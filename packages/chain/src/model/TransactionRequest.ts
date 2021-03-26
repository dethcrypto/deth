import {
  Address,
  Quantity,
  HexData,
  makeQuantity,
  makeAddress,
  makeHexData,
} from './primitives'
import { FakeTransaction } from 'ethereumjs-tx'
import { providers, utils } from 'ethers'

type WithoutPromises<T> = { [K in keyof T]: Exclude<T[K], Promise<unknown>> }
type EthersTxRequest = WithoutPromises<providers.TransactionRequest>

export interface RpcTransactionRequest {
  from?: Address
  to?: Address
  gas?: Quantity
  gasPrice?: Quantity
  value?: Quantity
  nonce?: Quantity
  data?: HexData
}

export function toFakeTransaction(tx: RpcTransactionRequest) {
  return new FakeTransaction({
    from: tx.from ?? '0x0000000000000000000000000000000000000000', // @TODO what should be a default address to use?
    to: tx.to,
    data: tx.data,
    gasLimit: tx.gas,
    gasPrice: tx.gasPrice,
    nonce: tx.nonce,
    value: tx.value,
  })
}

type Hexable = string | number | ArrayLike<number> | utils.Hexable

const toQuantity = (value: Hexable) =>
  makeQuantity(utils.hexStripZeros(utils.hexlify(value)))
const toAddress = (value: Hexable) => makeAddress(utils.hexlify(value))
const toHexData = (value: Hexable) => makeHexData(utils.hexlify(value))

export function toRpcTransactionRequest(
  transaction: EthersTxRequest
): RpcTransactionRequest {
  const result: RpcTransactionRequest = {}

  if (transaction.gasLimit) {
    result.gas = toQuantity(transaction.gasLimit)
  }
  if (transaction.gasPrice) {
    result.gasPrice = toQuantity(transaction.gasPrice)
  }
  if (transaction.nonce) {
    result.nonce = toQuantity(transaction.nonce)
  }
  if (transaction.value) {
    result.value = toQuantity(transaction.value)
  }
  if (transaction.from) {
    result.from = toAddress(transaction.from)
  }
  if (transaction.to) {
    result.to = toAddress(transaction.to)
  }
  if (transaction.data) {
    result.data = toHexData(transaction.data)
  }
  return result
}

export function toEthersTransaction(
  tx: RpcTransactionRequest
): EthersTxRequest {
  const result: EthersTxRequest = {}

  if (tx.data) {
    result.data = tx.data
  }
  if (tx.from) {
    result.from = tx.from
  }
  if (tx.gas) {
    result.gasLimit = tx.gas
  }
  if (tx.gasPrice) {
    result.gasPrice = tx.gasPrice
  }
  if (tx.nonce) {
    result.nonce = tx.nonce
  }
  if (tx.to) {
    result.to = tx.to
  }
  if (tx.value) {
    result.value = tx.value
  }

  return result
}
