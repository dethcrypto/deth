import { State } from './State'
import { Bytes } from './Bytes'
import { VMError } from './errors'

export type ExecutionResult =
  | ExecutionSuccess
  | ExecutionRevert
  | ExecutionError

export interface ExecutionSuccess {
  type: 'ExecutionSuccess'
  state: State
  gasUsed: number
  gasRefund: number
  returnValue: Bytes
}

export interface ExecutionRevert {
  type: 'ExecutionRevert'
  gasUsed: number
  returnValue: Bytes
}

export interface ExecutionError {
  type: 'ExecutionError'
  error: VMError
}
