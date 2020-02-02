import { State } from './State'
import { Byte } from './Byte'
import { VMError } from './errors'

export type ExecutionResult =
  | ExecutionSuccess
  | ExecutionRevert
  | ExecutionError

export interface ExecutionSuccess {
  type: 'ExecutionSuccess',
  state: State,
  gasUsed: number,
  gasRefund: number,
  returnValue: Byte[],
}

export interface ExecutionRevert {
  type: 'ExecutionRevert',
  gasUsed: number,
  returnValue: Byte[],
}

export interface ExecutionError {
  type: 'ExecutionError',
  error: VMError,
}
