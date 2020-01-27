import { Stack } from './Stack'
import { OutOfGas } from './errors'
import { Memory, GasAwareMemory } from './Memory'
import { State } from './State'
import { Byte } from './Byte'
import { Message } from './Message'
import { Opcode } from './opcodes'
import { parseBytecode } from './parseBytecode'

export class ExecutionContext {
  code: Opcode[]
  stack = new Stack()
  memory: GasAwareMemory
  state: State
  returnValue?: Byte[]
  reverted = false
  programCounter = 0

  private _gasUsed = 0
  private _gasRefund = 0

  constructor (public message: Message) {
    this.state = message.state.clone()
    this.code = parseBytecode(message.code)
    this.memory = new GasAwareMemory(
      new Memory(),
      this.useGas.bind(this)
    )
  }

  get gasUsed () {
    return this._gasUsed
  }

  useGas (gas: number) {
    this._gasUsed += gas
    if (this._gasUsed > this.message.gasLimit) {
      this._gasUsed = this.message.gasLimit
      throw new OutOfGas()
    }
  }

  useRemainingGas () {
    this._gasUsed = this.message.gasLimit
  }

  get gasRefund () {
    return this._gasRefund
  }

  refund (gas: number) {
    this._gasRefund += gas
  }
}
