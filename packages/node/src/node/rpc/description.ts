import * as t from 'io-ts'
import { utils } from 'ethers'
import { AsyncOrSync } from 'ts-essentials'
import { toBuffer } from 'ethereumjs-util'

// https://github.com/ethereum/wiki/wiki/JSON-RPC#hex-value-encoding
// internally we represent numbers as BN but externally it's a hex string
export const quantity = new t.Type<utils.BigNumber, string, unknown>(
  'RPC_QUANTITY',
  (u: unknown): u is utils.BigNumber => u instanceof utils.BigNumber,
  (input, c) => {
    try {
      const parsed = new utils.BigNumber(input as any)
      return t.success(parsed)
    } catch (e) {
      return t.failure(`Can't parse ${input} as quantity`, c)
    }
  },
  quantity => {
    return quantity.toHexString()
  },
)

// https://github.com/ethereum/wiki/wiki/JSON-RPC#hex-value-encoding
// internally we represent unformatted data as buffers, externally as hex strings
export const data = new t.Type<Buffer, string, unknown>(
  'RPC_DATA',
  (u: unknown): u is Buffer => u instanceof Buffer,
  (input, c) => {
    try {
      const parsed = toBuffer(input)
      return t.success(parsed)
    } catch (e) {
      return t.failure(`Can't parse ${input} as quantity`, c)
    }
  },
  data => '0x' + data.toString('hex'),
)

export const tag = t.union([
  t.literal('earliest'),
  t.literal('latest'),
  t.literal('pending'),
])

export const quantityOrTag = t.union([quantity, tag])
export type quantityOrTagType = t.TypeOf<typeof quantityOrTag>;

// https://github.com/ethereum/wiki/wiki/JSON-RPC#returns-26
const blockInfo = t.type({
  number: quantity,
  hash: data,
  parentHash: data,
  nonce: data,
  sha3uncles: data,
  logsBloom: data,
  transactionsRoot: data,
  stateRoot: data,
  receiptsRoot: data,
  miner: data,
  difficulty: quantity,
  totalDifficulty: quantity,
  extraData: data,
  size: quantity,
  gasLimit: quantity,
  gasUsed: quantity,
  timestamp: quantity,
  transactions: t.array(data),
  uncles: t.array(data),
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
    parameters: t.tuple([data, quantityOrTag]),
    returns: quantity,
  },
  eth_blockNumber: {
    parameters: t.undefined,
    returns: quantity,
  },
  eth_getTransactionCount: {
    parameters: t.tuple([data, quantityOrTag]),
    returns: quantity,
  },
  eth_getCode: {
    parameters: t.tuple([data, quantityOrTag]),
    returns: data,
  },
  eth_getBlockByNumber: {
    parameters: t.tuple([quantityOrTag, t.boolean]),
    returns: blockInfo,
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
