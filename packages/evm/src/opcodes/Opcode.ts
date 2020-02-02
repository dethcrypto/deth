import { ExecutionContext } from '../ExecutionContext'

export type Opcode = (ctx: ExecutionContext) => void
