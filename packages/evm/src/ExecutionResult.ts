import { State } from './State'
import { Byte } from './Byte'
import { VMError } from './errors'

export interface ExecutionResult {
  state: State,
  gasUsed: number,
  gasRefund: number,
  reverted: boolean,
  returnValue?: Byte[],
  error?: VMError,
}
