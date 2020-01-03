import { RPCExecutorType } from './description'
import { NodeCtx } from '../node'
import { CHAIN_ID } from '../../constants'
import { RpcBlockResponse, RpcTransactionReceipt } from '../../model'

type NoNullProperties<T> = { [K in keyof T]: Exclude<T[K], null> };
type SafeBlock = NoNullProperties<RpcBlockResponse>;
type SafeTxReceipt = NoNullProperties<RpcTransactionReceipt>;

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
    eth_getTransactionReceipt: ([txHash]) =>
      catchAsNull(() => ctx.chain.getTransactionReceipt(txHash) as any), // @TODO: types
  }
}

const catchAsNull = async (fn: Function) => {
  try {
    return await fn()
  } catch (e) {
    return null
  }
}
