import { RPCExecutorType } from './description'
import { NodeCtx } from '../node'
import { CHAIN_ID } from '../../constants'
import { RpcBlockResponse } from '../../model'

type NoNullProperties<T> = { [K in keyof T]: Exclude<T[K], null> };
type SafeBlock = NoNullProperties<RpcBlockResponse>;

// NOTE: we don't pass real blockOrTag value here but rather always use latest b/c it's not yet properly implemented
export const rpcExecutorFromCtx = (ctx: NodeCtx): RPCExecutorType => {
  return {
    web3_clientVersion: () => 'Deth/0.0.1', // @todo real value here
    net_version: () => CHAIN_ID.toString(),

    // eth
    eth_gasPrice: () => ctx.chain.getGasPrice(),
    eth_getBalance: ([address, blockTag]) =>
      ctx.chain.getBalance(address, 'latest'),
    eth_blockNumber: () => ctx.chain.getBlockNumber(),
    eth_getCode: ([address, blockTag]) => ctx.chain.getCode(address, 'latest'),
    eth_getTransactionCount: ([address, _blockTag]) =>
      ctx.chain.getTransactionCount(address, 'latest'),
    eth_getBlockByNumber: async ([blockTag, includeTransactions]) => {
      const block = await ctx.chain.getBlock('latest', false)
      return block as SafeBlock
    },
    eth_sendRawTransaction: ([signedTx]) => ctx.chain.sendTransaction(signedTx),
    // @TODO: rewrite chain to return undefined instead of throw
    eth_getTransactionReceipt: ([txHash]) =>
      catchAsNull(() => ctx.chain.getTransactionReceipt(txHash)),
  }
}

const catchAsNull = <T>(fn: () => T): T | null => {
  try {
    return fn()
  } catch (e) {
    return null
  }
}
