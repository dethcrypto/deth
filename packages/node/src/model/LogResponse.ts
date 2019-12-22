/* eslint-disable max-len */
import { Address, HexString, Hash } from './strings'

// https://github.com/ethers-io/ethers.js/blob/4ac08432b8e2c7c374dc4a0e141a39a369e2d430/src.ts/providers/base-provider.ts#L383
export interface LogResponse {
  blockNumber?: number,
  blockHash?: Hash,
  transactionIndex?: number,
  removed?: boolean,
  address: Address,
  data: HexString,
  topics: Hash[],
  transactionHash: Hash,
  logIndex: number,
}
