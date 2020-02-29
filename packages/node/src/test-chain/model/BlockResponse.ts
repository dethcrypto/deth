import {
  Address,
  Hash,
  Quantity,
  bufferToHash,
  HexData,
  bufferToQuantity,
  numberToQuantity,
  bufferToHexData,
  bufferToAddress,
} from './primitives'
import { RpcTransactionResponse } from './RpcTransactionResponse'
import Block from 'ethereumjs-block'

interface RpcBlockResponseBase {
  number: Quantity,
  hash: Hash,
  parentHash: Hash,
  nonce: HexData,
  sha3Uncles: Hash,
  logsBloom: HexData,
  transactionsRoot: Hash,
  stateRoot: Hash,
  receiptsRoot: Hash,
  miner: Address,
  difficulty: Quantity,
  totalDifficulty: Quantity,
  extraData: HexData,
  size: Quantity,
  gasLimit: Quantity,
  gasUsed: Quantity,
  timestamp: Quantity,
  uncles: Hash[],
}

export interface RpcBlockResponse extends RpcBlockResponseBase {
  transactions: Hash[],
}

export interface RpcRichBlockResponse extends RpcBlockResponseBase {
  transactions: RpcTransactionResponse[],
}

export function toBlockResponse (block: Block): RpcBlockResponse {
  return {
    number: bufferToQuantity(block.header.number),
    hash: bufferToHash(block.hash()),
    parentHash: bufferToHash(block.header.parentHash), // common.hash
    nonce: bufferToHexData(block.header.nonce),
    sha3Uncles: bufferToHash(block.header.uncleHash),
    logsBloom: bufferToHexData(block.header.bloom),
    transactionsRoot: bufferToHash(block.header.transactionsTrie),
    stateRoot: bufferToHash(block.header.stateRoot),
    receiptsRoot: bufferToHash(block.header.receiptTrie),
    miner: bufferToAddress(block.header.coinbase),
    difficulty: bufferToQuantity(block.header.difficulty),
    // Taken from ganache-core LOL TODO: Do something better here
    totalDifficulty: bufferToQuantity(block.header.difficulty),
    extraData: bufferToHexData(block.header.extraData),
    // Taken from ganache-core LOL TODO: Do something better here
    size: numberToQuantity(1000),
    gasLimit: bufferToQuantity(block.header.gasLimit),
    gasUsed: bufferToQuantity(block.header.gasUsed),
    timestamp: bufferToQuantity(block.header.timestamp),
    transactions: block.transactions.map(tx => bufferToHash(tx.hash())),
    uncles: [],
  }
}
