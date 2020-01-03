import * as t from 'io-ts'
import { AsyncOrSync } from 'ts-essentials'
import { quantity, hash, hexData, address, nullable } from './codecs'

export const tag = t.union([
  t.literal('earliest'),
  t.literal('latest'),
  t.literal('pending'),
])

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
  to: nullable(address),
  cumulativeGasUsed: quantity,
  gasUsed: quantity,
  contractAddress: nullable(address),
  logs: t.array(hexData), // @TODO types
  logsBloom: hexData,
  status: quantity,
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
    returns: nullable(txReceipt),
  },
}

type rpcCommandsDescriptionType = typeof rpcCommandsDescription;
type RpcCommandsParamsType = {
  [K in keyof rpcCommandsDescriptionType]: t.TypeOf<
  rpcCommandsDescriptionType[K]['parameters']
  >;
};
type RpcCommandsReturnsType = {
  [K in keyof rpcCommandsDescriptionType]: t.TypeOf<
  rpcCommandsDescriptionType[K]['returns']
  >;
};
export type RPCExecutorType = {
  [cmd in keyof rpcCommandsDescriptionType]: (
    params: RpcCommandsParamsType[cmd]
  ) => AsyncOrSync<RpcCommandsReturnsType[cmd]>;
};
