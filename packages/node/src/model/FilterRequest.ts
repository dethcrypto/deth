/* eslint-disable max-len */
import { Address, BlockTag, Hash } from './strings'

// https://github.com/ethers-io/ethers.js/blob/4ac08432b8e2c7c374dc4a0e141a39a369e2d430/src.ts/providers/base-provider.ts#L376
export type FilterRequest = FilterByRangeRequest | FilterByBlockRequest

// https://github.com/ethers-io/ethers.js/blob/4ac08432b8e2c7c374dc4a0e141a39a369e2d430/src.ts/providers/base-provider.ts#L363
export interface FilterByRangeRequest {
  fromBlock?: BlockTag,
  toBlock?: BlockTag,
  address?: Address,
  topics?: unknown,
}

// https://github.com/ethers-io/ethers.js/blob/4ac08432b8e2c7c374dc4a0e141a39a369e2d430/src.ts/providers/base-provider.ts#L370
export interface FilterByBlockRequest {
  blockHash?: Hash,
  address?: Address,
  topics?: unknown,
}
