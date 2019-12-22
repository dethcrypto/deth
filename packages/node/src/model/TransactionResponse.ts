/* eslint-disable max-len */
import { utils } from 'ethers'
import { Address, HexString, Hash } from './strings'
import { Transaction } from 'ethereumjs-tx'
import Block from 'ethereumjs-block'
import { bufferToHex, bufferToInt } from 'ethereumjs-util'
import { bufferToAddress } from '../utils'

// https://github.com/ethers-io/ethers.js/blob/4ac08432b8e2c7c374dc4a0e141a39a369e2d430/src.ts/providers/base-provider.ts#L184
export interface TransactionResponse {
  hash: Hash,
  blockHash?: Hash,
  blockNumber?: number,
  transactionIndex?: number,
  confirmations?: number,
  from: Address,
  gasPrice: utils.BigNumber,
  gasLimit: utils.BigNumber,
  to?: Address,
  value: utils.BigNumber,
  nonce: number,
  data: HexString,
  r: HexString,
  s: HexString,
  v?: number,
  creates?: Address,
  raw?: HexString,
  // https://github.com/ethers-io/ethers.js/blob/4ac08432b8e2c7c374dc4a0e141a39a369e2d430/src.ts/providers/base-provider.ts#L230
  networkId?: number,
}

export function toTransactionResponse (transaction: Transaction, block: Block): TransactionResponse {
  return {
    hash: bufferToHex(transaction.hash()),
    blockHash: bufferToHex(block.hash()),
    blockNumber: bufferToInt(block.header.number),
    transactionIndex: block.transactions.indexOf(transaction),
    // TODO: confirmations
    from: bufferToAddress(transaction.getSenderAddress()),
    gasPrice: utils.bigNumberify(transaction.gasPrice),
    gasLimit: utils.bigNumberify(transaction.gasLimit),
    to: bufferToAddress(transaction.to),
    value: utils.bigNumberify(transaction.value),
    nonce: bufferToInt(transaction.nonce),
    data: bufferToHex(transaction.data),
    r: bufferToHex(transaction.r),
    s: bufferToHex(transaction.s),
    v: bufferToInt(transaction.v),
    // TODO: creates
    // TODO: raw
    // TODO: networkId
  }
}
