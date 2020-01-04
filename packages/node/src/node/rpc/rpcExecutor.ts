import { RPCExecutorType } from './description'
import { NodeCtx } from '../ctx'
import { CHAIN_ID } from '../../constants'
import { RpcBlockResponse, toEthersTransaction } from '../../model'
import { BadRequestHttpError } from '../errorHandler'
import { makeHexData } from '../../primitives'

type NoNullProperties<T> = { [K in keyof T]: Exclude<T[K], null> }
type SafeBlock = NoNullProperties<RpcBlockResponse>

// NOTE: we don't pass real blockOrTag value here but rather always use latest b/c it's not yet properly implemented
export const rpcExecutorFromCtx = (ctx: NodeCtx): RPCExecutorType => {
  return {
    web3_clientVersion: () => 'Deth/0.0.1', // @todo real value here
    net_version: () => CHAIN_ID.toString(),

    // eth
    eth_gasPrice: () => ctx.chain.getGasPrice(),
    eth_getBalance: ([address, blockTag]) => {
      return ctx.chain.getBalance(address, 'latest')
    },
    eth_blockNumber: () => ctx.chain.getBlockNumber(),
    eth_getCode: ([address, blockTag]) => ctx.chain.getCode(address, 'latest'),
    eth_getTransactionCount: ([address, _blockTag]) => ctx.chain.getTransactionCount(address, 'latest'),
    eth_getBlockByNumber: async ([blockTag, includeTransactions]) => {
      const block = await ctx.chain.getBlock('latest', false)
      return block as SafeBlock
    },
    // @TODO: rewrite chain to return undefined instead of throw
    eth_getTransactionReceipt: ([txHash]) => catchAsNull(() => ctx.chain.getTransactionReceipt(txHash) as any),
    eth_sendRawTransaction: ([signedTx]) => ctx.chain.sendTransaction(signedTx),
    eth_sendTransaction: async ([tx]) => {
      const { from, ...pureTx } = tx
      const wallet = ctx.provider.getWalletForPublicKey(from)
      if (!wallet) {
        throw new BadRequestHttpError([`Can't sign tx. ${from} is not unlocked!`])
      }
      const signedTx = makeHexData(await wallet.sign(toEthersTransaction(pureTx)))

      return ctx.chain.sendTransaction(signedTx)
    },
  }
}

const catchAsNull = <T>(fn: () => T): T | null => {
  try {
    return fn()
  } catch (e) {
    return null
  }
}
