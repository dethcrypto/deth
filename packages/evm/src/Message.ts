import { Address } from './Address'
import { Bytes32 } from './Bytes32'
import { Byte } from './Byte'

export interface Message {
  readonly account: Address,
  readonly code: readonly Byte[],
  readonly data: readonly Byte[],
  readonly origin: Address,
  readonly sender: Address,
  readonly gasLimit: number,
  readonly gasPrice: Bytes32,
  readonly value: Bytes32,
  readonly enableStateModifications: boolean,
  readonly callDepth: number,
}
