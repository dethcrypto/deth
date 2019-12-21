import { Bytes32, Bytes20 } from './utils'

export interface PendingTransaction {
  hash: Bytes32,
  from: Bytes20,
  to: Bytes20,
  value: Bytes32,
}
