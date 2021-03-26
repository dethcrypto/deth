import { Address } from './Address'
import { Bytes32 } from './Bytes32'
import { Bytes } from './Bytes'

export interface Message {
  readonly account: Address
  readonly code: Bytes
  readonly data: Bytes
  readonly origin: Address
  readonly sender: Address
  readonly gasLimit: number
  readonly gasPrice: Bytes32
  readonly value: Bytes32
  readonly enableStateModifications: boolean
  readonly callDepth: number
}
