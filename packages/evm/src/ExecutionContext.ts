import { Stack } from './Stack'
import { OutOfGas } from './errors'
import { Memory } from './Memory'
import { State } from './State'
import { Message } from './Message'
import { Opcode } from './opcodes'
import { parseBytecode } from './parseBytecode'
import { Bytes } from './Bytes'

export class ExecutionContext {
  code: Opcode[]
  stack = new Stack()
  memory: Memory
  returnValue?: Bytes
  reverted = false
  programCounter = 0

  private _gasUsed = 0
  private _gasRefund = 0

  constructor(public message: Message, public state: State) {
    this.code = parseBytecode(message.code)
    this.memory = new Memory(this.useGas.bind(this))
  }

  get gasUsed() {
    return this._gasUsed
  }

  useGas(gas: number) {
    this._gasUsed += gas
    if (this._gasUsed > this.message.gasLimit) {
      this._gasUsed = this.message.gasLimit
      throw new OutOfGas()
    }
  }

  get gasRefund() {
    return this._gasRefund
  }

  refund(gas: number) {
    this._gasRefund += gas
  }
}
