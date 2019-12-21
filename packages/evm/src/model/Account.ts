import { Bytes32, Bytes } from './utils'

export interface Account {
  balance: Bytes32,
  nonce: number,
  storage: Map<Bytes32, Bytes32>,
  code: Bytes,
}
