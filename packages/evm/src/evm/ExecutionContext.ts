import { Stack } from './Stack'
import { Opcode } from './opcodes'

export interface ExecutionContext {
  stack: Stack,
  code: Opcode[],
  gasUsed: number,
  running: boolean,
  programCounter: number,
}
