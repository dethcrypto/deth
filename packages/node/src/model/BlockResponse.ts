/* eslint-disable max-len */
import {
  Address,
  HexString,
  Hash,
  Quantity,
  bufferToAddress,
  bufferToHexString,
  bufferToHash,
  bufferToQuantity,
} from '../primitives'
import { TransactionResponse } from './TransactionResponse'
import Block from 'ethereumjs-block'

export type BlockResponse = BlockResponseWithTxHashes | BlockResponseWithTxResponses

// https://github.com/ethers-io/ethers.js/blob/4ac08432b8e2c7c374dc4a0e141a39a369e2d430/src.ts/providers/base-provider.ts#L259
export interface BlockResponseWithTxHashes {
  hash: Hash,
  parentHash: Hash,
  number: Quantity,
  timestamp: Quantity,
  nonce?: HexString,
  difficulty: Quantity,
  gasLimit: Quantity,
  gasUsed: Quantity,
  miner: Address,
  extraData: HexString,
  transactions: Hash[],
}

// https://github.com/ethers-io/ethers.js/blob/4ac08432b8e2c7c374dc4a0e141a39a369e2d430/src.ts/providers/base-provider.ts#L277
export interface BlockResponseWithTxResponses {
  hash: Hash,
  parentHash: Hash,
  number: Quantity,
  timestamp: Quantity,
  nonce?: HexString,
  difficulty: Quantity,
  gasLimit: Quantity,
  gasUsed: Quantity,
  miner: Address,
  extraData: HexString,
  transactions: TransactionResponse[],
}

export function toBlockResponse (block: Block): BlockResponse {
  return {
    difficulty: bufferToQuantity(block.header.difficulty),
    extraData: bufferToHexString(block.header.extraData),
    gasLimit: bufferToQuantity(block.header.gasLimit),
    gasUsed: bufferToQuantity(block.header.gasUsed),
    hash: bufferToHash(block.hash()),
    miner: bufferToAddress(block.header.coinbase),
    nonce: bufferToHexString(block.header.nonce),
    number: bufferToQuantity(block.header.number),
    parentHash: bufferToHash(block.header.parentHash),
    timestamp: bufferToQuantity(block.header.timestamp),
    transactions: block.transactions.map(x => bufferToHash(x.hash())),
  }
}
