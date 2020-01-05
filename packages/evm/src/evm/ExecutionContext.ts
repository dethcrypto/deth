import { Stack } from './Stack'
import { VMError } from './errors'

export interface ExecutionContext {
  stack: Stack,
  gasUsed: number,
  running: boolean,
  programCounter: number,
}
