import { GasCost } from './opcodes'
import { Byte } from './Byte'

export class Memory {
  private items: Byte[] = []
  private memoryUsed = 0
  private gasUsed = 0

  constructor (
    private useGas: (gas: number) => void,
  ) {}

  getSize () {
    return this.items.length
  }

  getBytes (offset: number, length: number) {
    this.onMemoryAccess(offset, length)
    if (length === 0) {
      return []
    }
    this.expand(offset + length)
    return this.items.slice(offset, offset + length)
  }

  setBytes (offset: number, bytes: Byte[]) {
    this.onMemoryAccess(offset, bytes.length)
    if (bytes.length === 0) {
      return
    }
    this.expand(offset + bytes.length)
    for (let i = 0; i < bytes.length; i++) {
      this.items[offset + i] = bytes[i]
    }
  }

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

  private expand (targetSize: number) {
    const targetLength = 32 * Math.ceil(targetSize / 32)
    for (let i = this.items.length; i < targetLength; i++) {
      this.items[i] = 0 as Byte
    }
  }
}
