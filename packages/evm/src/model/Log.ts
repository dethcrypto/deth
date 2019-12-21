import { Bytes, Bytes32, Bytes20 } from './utils'

export interface Log {
  address: Bytes20,
  data: Bytes,
  topics: Bytes32[],
}
