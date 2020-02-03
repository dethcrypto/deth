import * as t from 'io-ts'
import { AsyncOrSync } from 'ts-essentials'
import { quantity, hash, hexData, address, undefinable } from './codecs'

export const tag = t.union([t.literal('earliest'), t.literal('latest'), t.literal('pending')])

export const quantityOrTag = t.union([quantity, tag])

// https://github.com/ethereum/wiki/wiki/JSON-RPC#returns-26
const blockInfo = t.type({
  number: quantity,
  hash: hash,
  parentHash: hash,
  nonce: hexData,
  sha3Uncles: hash,
  logsBloom: hexData,
  transactionsRoot: hash,
  stateRoot: hash,
  receiptsRoot: hash,
  miner: address,
  difficulty: quantity,
  totalDifficulty: quantity,
  extraData: hexData,
  size: quantity,
  gasLimit: quantity,
  gasUsed: quantity,
  timestamp: quantity,
  transactions: t.array(hash),
  uncles: t.array(hash),
})

// https://github.com/ethereum/wiki/wiki/JSON-RPC#returns-31
const txReceipt = t.type({
  transactionHash: hash,
  transactionIndex: quantity,
  blockHash: hash,
  blockNumber: quantity,
  from: address,
  to: undefinable(address),
  cumulativeGasUsed: quantity,
  gasUsed: quantity,
  contractAddress: undefinable(address),
  logs: t.array(hexData), // @TODO types
  logsBloom: hexData,
  status: quantity,
})

// https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_sendtransaction
// @TODO: additional validation rule: if to === null then data can't be null
const tx = t.type({
  from: address,
  to: undefinable(address),
  gas: undefinable(quantity),
  gasPrice: undefinable(quantity),
  value: undefinable(quantity),
  data: undefinable(hexData),
  nonce: undefinable(quantity),
})
// https://github.com/ethereum/wiki/wiki/JSON-RPC#parameters-24
const callTtx = t.type({
  from: undefinable(address),
  to: undefinable(address),
  gas: undefinable(quantity),
  gasPrice: undefinable(quantity),
  value: undefinable(quantity),
  data: undefinable(hexData),
})

export const rpcCommandsDescription = {
  web3_clientVersion: {
    parameters: t.undefined,
    returns: t.string,
  },
  net_version: {
    parameters: t.undefined,
    returns: t.string,
  },

  // eth related
  eth_gasPrice: {
    parameters: t.undefined,
    returns: quantity,
  },
  eth_getBalance: {
    parameters: t.tuple([address, quantityOrTag]),
    returns: quantity,
  },
  eth_blockNumber: {
    parameters: t.undefined,
    returns: quantity,
  },
  eth_getTransactionCount: {
    parameters: t.tuple([address, quantityOrTag]),
    returns: quantity,
  },
  eth_getCode: {
    parameters: t.tuple([address, quantityOrTag]),
    returns: hexData,
  },
  eth_getBlockByNumber: {
    parameters: t.tuple([quantityOrTag, t.boolean]),
    returns: blockInfo,
  },
  eth_sendRawTransaction: {
    parameters: t.tuple([hexData]),
    returns: hash,
  },
  eth_getTransactionReceipt: {
    parameters: t.tuple([hash]),
    returns: undefinable(txReceipt),
  },
  eth_sendTransaction: {
    parameters: t.tuple([tx]),
    returns: hash,
  },
  eth_call: {
    parameters: t.tuple([callTtx, quantityOrTag]),
    returns: hexData,
  },
  eth_estimateGas: {
    parameters: t.tuple([callTtx]),
    returns: quantity,
  },

  // ganache compatibility
  // docs: https://github.com/trufflesuite/ganache-cli#custom-methods
  // note: ganache uses regular numbers as types
  evm_increaseTime: {
    parameters: t.tuple([t.number]),
    returns: quantity,
  },
  miner_start: {
    parameters: t.undefined,
    returns: t.literal(true),
  },
  miner_stop: {
    parameters: t.undefined,
    returns: t.literal(true),
  },
  evm_mine: {
    parameters: t.undefined, // @todo: missing param, timestamp of a block to be mined
    returns: quantity,
  },
  evm_snapshot: {
    parameters: t.undefined,
    returns: quantity,
  },
  evm_revert: {
    parameters: t.tuple([quantity]),
    returns: t.literal(true),
  },
}

type rpcCommandsDescriptionType = typeof rpcCommandsDescription
type RpcCommandsParamsType = {
  [K in keyof rpcCommandsDescriptionType]: t.TypeOf<rpcCommandsDescriptionType[K]['parameters']>
}
type RpcCommandsReturnsType = {
  [K in keyof rpcCommandsDescriptionType]: t.TypeOf<rpcCommandsDescriptionType[K]['returns']>
}
export type RPCExecutorType = {
  [cmd in keyof rpcCommandsDescriptionType]: (
    params: RpcCommandsParamsType[cmd]
  ) => AsyncOrSync<RpcCommandsReturnsType[cmd]>
}
