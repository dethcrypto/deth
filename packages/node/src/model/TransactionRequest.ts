import { Address, Quantity, HexData } from '../primitives'
import { FakeTransaction } from 'ethereumjs-tx'

export interface RpcTransactionRequest {
  from?: Address,
  to?: Address,
  gas?: Quantity,
  gasPrice?: Quantity,
  value?: Quantity,
  nonce?: Quantity,
  data?: HexData,
}

export function toFakeTransaction (tx: RpcTransactionRequest) {
  return new FakeTransaction({
    from: tx.from,
    to: tx.to,
    data: tx.data,
    gasLimit: tx.gas,
    gasPrice: tx.gasPrice,
    nonce: tx.nonce,
    value: tx.value,
  })
}
