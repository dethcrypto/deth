import { RPCExecutorType } from './description'
import { NodeCtx } from '../node'
import { utils } from 'ethers'
import { toBuffer, bufferToHex } from 'ethereumjs-util'
import { CHAIN_ID } from '../../constants'

export const rpcExecutorFromCtx = (ctx: NodeCtx): RPCExecutorType => {
  return {
    web3_clientVersion: () => 'Deth/0.0.1', // @todo real value here
    net_version: () => CHAIN_ID.toString(),

    // eth
    eth_gasPrice: () => ctx.chain.getGasPrice(),
    eth_getBalance: ([address, _blockOrTag]) => {
      return ctx.chain.getBalance(bufferToHex(address), 'latest')
    },
    eth_blockNumber: async () => {
      const blockNumber = await ctx.chain.getBlockNumber()
      return utils.bigNumberify(blockNumber)
    },
    eth_getCode: ([address, _blockOrTag]) => {
      return toBuffer(ctx.chain.getCode(bufferToHex(address), 'latest'))
    },
    eth_getTransactionCount: async ([address]) => {
      const txCount = await ctx.chain.getTransactionCount(
        bufferToHex(address),
        'latest',
      )

      return utils.bigNumberify(txCount)
    },
    eth_getBlockByNumber: async ([_blockOrTag, _includeTxs]) => {
      // @todo doesn't include txs
      const block = await ctx.chain.getBlock('latest', false)

      return {
        number: utils.bigNumberify(block.number),
        hash: toBuffer(block.hash),
        parentHash: toBuffer(block.parentHash),
        nonce: toBuffer(block.nonce!),
        sha3uncles: toBuffer('0x0'),
        logsBloom: toBuffer('0x0'),
        transactionsRoot: toBuffer('0x0'),
        stateRoot: toBuffer('0x0'),
        receiptsRoot: toBuffer('0x0'),
        miner: toBuffer(block.miner),
        difficulty: utils.bigNumberify(block.difficulty),
        totalDifficulty: utils.bigNumberify(block.difficulty), // @todo, probably it should be tracked in chain class
        extraData: toBuffer(block.extraData),
        size: utils.bigNumberify(100), // @todo
        gasLimit: utils.bigNumberify(block.gasLimit),
        gasUsed: utils.bigNumberify(block.gasUsed),
        timestamp: utils.bigNumberify(block.timestamp),
        transactions: [],
        uncles: [],
      }
    },
  }
}
