import { HexData, makeQuantity, makeAddress, makeHexData } from './primitives'
import { Transaction } from '@ethereumjs/tx'
import { providers, utils } from 'ethers'
import { Address } from 'ethereumjs-util'

type WithoutPromises<T> = { [K in keyof T]: Exclude<T[K], Promise<unknown>> }
type EthersTxRequest = WithoutPromises<providers.TransactionRequest>

export interface RpcTransactionRequest {
  from?: string
  to?: string
  gas?: string
  gasPrice?: string
  value?: string
  nonce?: string
  data?: HexData
}

// See https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/README.md#fake-transaction
export function toFakeTransaction(txParams: RpcTransactionRequest) {
  const from = Address.fromString(
    txParams.from ?? '0x0000000000000000000000000000000000000000'
  )

  delete txParams.from

  const tx = Transaction.fromTxData(txParams)

  // override getSenderAddress
  tx.getSenderAddress = () => {
    return from
  }

  return tx
}

type Hexable = string | number | ArrayLike<number> | utils.Hexable

const toQuantity = (value: string) =>
  makeQuantity(utils.hexStripZeros(utils.hexlify(value)))
const toAddress = (value: Hexable) => makeAddress(utils.hexlify(value))
const toHexData = (value: Hexable) => makeHexData(utils.hexlify(value))

export function toRpcTransactionRequest(
  transaction: EthersTxRequest
): RpcTransactionRequest {
  const result: RpcTransactionRequest = {}

  if (transaction.gasLimit) {
    result.gas = toQuantity(transaction.gasLimit.toString())
  }
  if (transaction.gasPrice) {
    result.gasPrice = toQuantity(transaction.gasPrice.toString())
  }
  if (transaction.nonce) {
    result.nonce = toQuantity(transaction.nonce.toString())
  }
  if (transaction.value) {
    result.value = toQuantity(transaction.value.toString())
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
