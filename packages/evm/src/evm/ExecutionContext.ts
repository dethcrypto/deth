import { Stack } from './Stack'
import { Opcode, GasCost } from './opcodes'
import { OutOfGas } from './errors'

export class ExecutionContext {
  stack = new Stack()
  private gasUsed = 0
  private memoryUsed = 0
  private gasUsedForMemory = 0
  running = true
  programCounter = 0

  constructor (
    public code: Opcode[],
    public gasLimit: number,
  ) {}

  getGasUsed () {
    return this.gasUsed
  }

  useGas (gas: number) {
    this.gasUsed += gas
    if (this.gasUsed > this.gasLimit) {
      this.gasUsed = this.gasLimit
      throw new OutOfGas()
    }
  }

  useMemory (offset: number, length: number) {
    if (length === 0) {
      return
    }
    const words = Math.ceil((offset + length) / 32)
    if (words <= this.memoryUsed) {
      return
    }
    const gasCost = words * GasCost.MEMORY + Math.floor(words * words / 512)
    if (this.gasUsedForMemory < gasCost) {
      this.useGas(gasCost - this.gasUsedForMemory)
      this.gasUsedForMemory = gasCost
    }
  }
}
