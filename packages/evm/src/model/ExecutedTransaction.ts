import { Bytes32 } from './utils'
import { Log } from './Log'

export interface ExecutedTransaction {
  hash: Bytes32,
  logs: Log[],
}
