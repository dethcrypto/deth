/* eslint-disable max-len */
import { utils } from 'ethers'
import { Address, HexString, Hash } from './primitives'
import { TransactionResponse } from './TransactionResponse'
import Block from 'ethereumjs-block'
import { bufferToInt } from 'ethereumjs-util'
import { bufferToAddress, bufferToHexString, bufferToHash } from '../utils'

export type BlockResponse = BlockResponseWithTxHashes | BlockResponseWithTxResponses

// https://github.com/ethers-io/ethers.js/blob/4ac08432b8e2c7c374dc4a0e141a39a369e2d430/src.ts/providers/base-provider.ts#L259
export interface BlockResponseWithTxHashes {
  hash: Hash,
  parentHash: Hash,
  number: number,
  timestamp: number,
  nonce?: HexString,
  difficulty: number,
  gasLimit: utils.BigNumber,
  gasUsed: utils.BigNumber,
  miner: Address,
  extraData: HexString,
  transactions: Hash[],
}

// https://github.com/ethers-io/ethers.js/blob/4ac08432b8e2c7c374dc4a0e141a39a369e2d430/src.ts/providers/base-provider.ts#L277
export interface BlockResponseWithTxResponses {
  hash: Hash,
  parentHash: Hash,
  number: number,
  timestamp: number,
  nonce?: HexString,
  difficulty: number,
  gasLimit: utils.BigNumber,
  gasUsed: utils.BigNumber,
  miner: Address,
  extraData: HexString,
  transactions: TransactionResponse[],
}

export function toBlockResponse (block: Block): BlockResponse {
  return {
    difficulty: bufferToInt(block.header.difficulty),
    extraData: bufferToHexString(block.header.extraData),
    gasLimit: utils.bigNumberify(block.header.gasLimit),
    gasUsed: utils.bigNumberify(block.header.gasUsed),
    hash: bufferToHash(block.hash()),
    miner: bufferToAddress(block.header.coinbase),
    nonce: bufferToHexString(block.header.nonce),
    number: bufferToInt(block.header.number),
    parentHash: bufferToHash(block.header.parentHash),
    timestamp: bufferToInt(block.header.timestamp),
    transactions: block.transactions.map(x => bufferToHash(x.hash())),
  }
}
