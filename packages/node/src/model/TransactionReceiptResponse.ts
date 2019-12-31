/* eslint-disable max-len */
import { utils } from 'ethers'
import { Address, HexString, Hash, Quantity } from './primitives'

// https://github.com/ethers-io/ethers.js/blob/4ac08432b8e2c7c374dc4a0e141a39a369e2d430/src.ts/providers/base-provider.ts#L317
export interface TransactionReceiptResponse {
  to?: Address,
  from: Address, // originally optional
  contractAddress?: Address,
  transactionIndex: Quantity,
  root?: Hash,
  gasUsed: Quantity,
  logsBloom: HexString, // originally optional
  blockHash: Hash,
  transactionHash: Hash,
  logs: TransactionReceiptLogResponse[],
  blockNumber: Quantity,
  // SKIP confirmations?: number - ethers automatically calculates this
  cumulativeGasUsed: Quantity,
  status: Quantity, // originally optional
}

// https://github.com/ethers-io/ethers.js/blob/4ac08432b8e2c7c374dc4a0e141a39a369e2d430/src.ts/providers/base-provider.ts#L301
export interface TransactionReceiptLogResponse {
  transactionLogIndex?: Quantity,
  transactionIndex: Quantity,
  blockNumber: Quantity,
  transactionHash: Hash,
  address: Address,
  topics: Hash[],
  data: HexString,
  logIndex: Quantity,
  blockHash: Hash,
}
