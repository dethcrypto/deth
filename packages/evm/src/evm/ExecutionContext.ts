import { Stack } from '../Stack'

export interface ExecutionContext {
  stack: Stack,
  gasUsed: number,
  running: boolean,
  programCounter: number,
}
