/* eslint-disable max-len */
import { utils } from 'ethers'
import { Address, HexString, Hash } from './strings'

// https://github.com/ethers-io/ethers.js/blob/4ac08432b8e2c7c374dc4a0e141a39a369e2d430/src.ts/providers/base-provider.ts#L317
export interface TransactionReceiptResponse {
  to?: Address,
  from?: Address,
  contractAddress?: Address,
  transactionIndex: number,
  root?: Hash,
  gasUsed: utils.BigNumber,
  logsBloom?: HexString,
  blockHash: Hash,
  transactionHash: Hash,
  logs: TransactionReceiptLogResponse[],
  blockNumber: number,
  confirmations?: number,
  cumulativeGasUsed: utils.BigNumber,
  status?: number,
}

// https://github.com/ethers-io/ethers.js/blob/4ac08432b8e2c7c374dc4a0e141a39a369e2d430/src.ts/providers/base-provider.ts#L301
export interface TransactionReceiptLogResponse {
  transactionLogIndex?: number,
  transactionIndex: number,
  blockNumber: number,
  transactionHash: Hash,
  address: Address,
  topics: Hash[],
  data: HexString,
  logIndex: number,
  blockHash: Hash,
}
