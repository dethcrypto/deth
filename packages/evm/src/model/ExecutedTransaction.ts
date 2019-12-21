import { Bytes32, Bytes20 } from './utils'
import { Log } from './Log'
import { ExecutionError } from './ExecutionError'

export interface ExecutedTransaction {
  hash: Bytes32,
  from: Bytes20,
  to: Bytes20,
  gasUsed: number,
  cumulativeGasUsed: number,
  contractAddress: Bytes20 | null,
  logs: Log[],
  error: ExecutionError | null,
}
