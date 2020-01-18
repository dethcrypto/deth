import { Stack } from './Stack'
import { Opcode } from './opcodes'
import { OutOfGas } from './errors'
import { Memory, GasAwareMemory } from './Memory'

export class ExecutionContext {
  stack = new Stack()
  memory = new GasAwareMemory(new Memory(), this.useGas.bind(this))
  returnValue?: number[]
  reverted = false
  programCounter = 0

  private gasUsed = 0

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

  useRemainingGas () {
    this.gasUsed = this.gasLimit
  }
}
