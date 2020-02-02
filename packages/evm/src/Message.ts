import { Address } from './Address'
import { Bytes32 } from './Bytes32'
import { Byte } from './Byte'
import { State } from './State'

export interface Message {
  account: Address,
  code: Byte[],
  data: Byte[],
  origin: Address,
  sender: Address,
  gasLimit: number,
  gasPrice: Bytes32,
  value: Bytes32,
  enableStateModifications: boolean,
  callDepth: number,
  state: State,
}
