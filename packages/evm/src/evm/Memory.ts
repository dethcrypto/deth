import { GasCost } from './opcodes'

export interface IMemory {
  getSize (): number,
  getBytes (offset: number, length: number): number[],
  setBytes (offset: number, bytes: number[]): void,
}

export class GasAwareMemory implements IMemory {
  constructor (
    public memory: IMemory,
    private useGas: (gas: number) => void,
  ) {}

  private memoryUsed = 0
  private gasUsed = 0

  private onMemoryAccess (offset: number, length: number) {
    if (length === 0) {
      return
    }
    const words = Math.ceil((offset + length) / 32)
    if (words <= this.memoryUsed) {
      return
    }
    const gas = words * GasCost.MEMORY + Math.floor(words * words / 512)
    if (this.gasUsed < gas) {
      this.useGas(gas - this.gasUsed)
      this.gasUsed = gas
    }
  }

  getSize () {
    return this.memory.getSize()
  }

  getBytes (offset: number, length: number) {
    this.onMemoryAccess(offset, length)
    return this.memory.getBytes(offset, length)
  }

  setBytes (offset: number, bytes: number[]) {
    this.onMemoryAccess(offset, bytes.length)
    this.memory.setBytes(offset, bytes)
  }
}

export class Memory implements IMemory {
  private items: number[] = []

  private expand (targetSize: number) {
    const targetLength = 32 * Math.ceil(targetSize / 32)
    for (let i = this.items.length; i < targetLength; i++) {
      this.items[i] = 0
    }
  }

  getSize () {
    return this.items.length
  }

  getBytes (offset: number, length: number) {
    if (length === 0) {
      return []
    }
    this.expand(offset + length)
    return this.items.slice(offset, offset + length)
  }

  setBytes (offset: number, bytes: number[]) {
    if (bytes.length === 0) {
      return
    }
    this.expand(offset + bytes.length)
    for (let i = 0; i < bytes.length; i++) {
      this.items[offset + i] = bytes[i]
    }
  }
}