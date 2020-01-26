import { RPCExecutorType } from './schema'
import { NodeCtx } from '../ctx'
import { CHAIN_ID } from '../../constants'
import { RpcBlockResponse, toEthersTransaction } from '../../model'
import { BadRequestHttpError } from '../errorHandler'
import { makeHexData, numberToQuantity, quantityToNumber } from '../../primitives'

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
    // @TODO: as any b/c logs are not implemented properly right now...
    eth_getTransactionReceipt: ([txHash]) => ctx.chain.getTransactionReceipt(txHash) as any,
    eth_sendRawTransaction: ([signedTx]) => ctx.chain.sendTransaction(signedTx),
    eth_sendTransaction: async ([tx]) => {
      const { from, nonce: _nonce, gas: _gas, ...restTx } = tx
      const wallet = ctx.walletManager.getWalletForAddress(from)
      if (!wallet) {
        throw new BadRequestHttpError([`Can't sign tx. ${from} is not unlocked!`])
      }

      const nonce = _nonce ?? (await ctx.chain.getTransactionCount(from, 'latest'))
      const gas = _gas ?? numberToQuantity(90_000)

      const signedTx = makeHexData(await wallet.sign(toEthersTransaction({ ...restTx, gas, nonce })))

      return ctx.chain.sendTransaction(signedTx)
    },
    eth_call: ([tx, _blockTag]) => ctx.chain.call(tx, 'latest'),

    // ganache compatibility
    evm_increaseTime: ([n]) => {
      // @TODO implement
      return numberToQuantity(n)
    },
    evm_mine: async () => {
      await ctx.chain.mineBlock()
      return numberToQuantity(0)
    },
    evm_snapshot: async () => {
      return numberToQuantity(ctx.chain.makeSnapshot())
    },
    evm_revert: async ([_n]) => {
      const n = quantityToNumber(_n)
      console.log(`Reverting to ${n}`)
      ctx.chain.revertToSnapshot(n)
      return true as const
    },
  }
}
