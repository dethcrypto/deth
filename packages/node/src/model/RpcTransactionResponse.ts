import { Address, Hash, Quantity, HexData } from '../primitives'

export interface RpcTransactionResponse {
  blockHash?: Hash,
  blockNumber?: Quantity,
  from: Address,
  gas: Quantity,
  gasPrice: Quantity,
  hash: Hash,
  input: HexData,
  nonce: Quantity,
  to?: Address,
  transactionIndex?: Quantity,
  value: Quantity,
  v: Quantity,
  r: Quantity,
  s: Quantity,
}
