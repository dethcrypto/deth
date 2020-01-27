import { Stack } from './Stack'
import { Opcode } from './opcodes'
import { OutOfGas } from './errors'
import { Memory, GasAwareMemory } from './Memory'
import { ReadonlyState, State } from './State'
import { Address } from './Address'
import { Byte } from './Byte'

export interface ExecutionParameters {
  address: Address,
  gasLimit: number,
  state: ReadonlyState,
}

export class ExecutionContext {
  stack = new Stack()
  memory = new GasAwareMemory(new Memory(), this.useGas.bind(this))
  returnValue?: Byte[]
  reverted = false
  programCounter = 0

  address: Address
  gasLimit: number
  state: State
  private gasUsed = 0
  private refund = 0

  constructor (
    public code: Opcode[],
    params: ExecutionParameters,
  ) {
    this.address = params.address
    this.gasLimit = params.gasLimit
    this.state = params.state.clone()
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
