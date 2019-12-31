import { Address, Hash, Quantity, HexData } from '../primitives'

export interface RpcTransactionResponse {
  blockHash: Hash | null,
  blockNumber: Quantity | null,
  from: Address,
  gas: Quantity,
  gasPrice: Quantity,
  hash: Hash,
  input: HexData,
  nonce: Quantity,
  to: Address | null,
  transactionIndex: Quantity | null,
  value: Quantity,
  v: Quantity,
  r: Quantity,
  s: Quantity,
}
