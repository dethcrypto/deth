import { RPCExecutorType } from './description'
import { NodeCtx } from '../node'
import { CHAIN_ID } from '../../constants'
import { RpcBlockResponse } from '../../model'

type NoNullProperties <T> = { [K in keyof T]: Exclude<T[K], null> }
type SafeBlock = NoNullProperties<RpcBlockResponse>

export const rpcExecutorFromCtx = (ctx: NodeCtx): RPCExecutorType => {
  return {
    web3_clientVersion: () => 'Deth/0.0.1', // @todo real value here
    net_version: () => CHAIN_ID.toString(),

    // eth
    eth_gasPrice: () => ctx.chain.getGasPrice(),
    eth_getBalance: ([address, blockTag]) => ctx.chain.getBalance(address, blockTag),
    eth_blockNumber: () => ctx.chain.getBlockNumber(),
    eth_getCode: ([address, blockTag]) => ctx.chain.getCode(address, blockTag),
    eth_getTransactionCount: ([address, blockTag]) =>
      ctx.chain.getTransactionCount(address, blockTag),
    eth_getBlockByNumber: async ([blockTag, includeTransactions]) => {
      const block = await ctx.chain.getBlock(blockTag, false)
      return block as SafeBlock
    },
  }
}
