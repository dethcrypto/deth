import { Stack } from './Stack'
import { Opcode } from './opcodes'
import { OutOfGas } from './errors'
import { Memory, GasAwareMemory } from './Memory'
import { Storage } from './Storage'

export interface ExecutionParameters {
  gasLimit: number,
  storage: Storage,
}

export class ExecutionContext {
  stack = new Stack()
  memory = new GasAwareMemory(new Memory(), this.useGas.bind(this))
  returnValue?: number[]
  reverted = false
  programCounter = 0

  gasLimit: number
  storage: Storage
  private gasUsed = 0
  private refund = 0

  constructor (
    public code: Opcode[],
    params: ExecutionParameters,
  ) {
    this.gasLimit = params.gasLimit
    this.storage = params.storage.clone()
  }

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

  addRefund (gas: number) {
    this.refund += gas
  }

  applyRefund () {
    const refund = Math.min(Math.floor(this.gasUsed / 2), this.refund)
    this.gasUsed -= refund
  }
}
