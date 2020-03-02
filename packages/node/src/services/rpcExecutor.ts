import { RPCExecutorType } from '../rpc/schema'
import {
  RpcBlockResponse,
  toEthersTransaction,
  makeHexData,
  numberToQuantity,
  quantityToNumber,
  makeAddress,
  ChainOptions,
  Chain,
} from '@ethereum-ts/chain'
import { BadRequestHttpError } from '../middleware/errorHandler'
import { WalletManager } from './WalletManager'

type NoNullProperties<T> = { [K in keyof T]: Exclude<T[K], null> }
type SafeBlock = NoNullProperties<RpcBlockResponse>

// NOTE: we don't pass real blockOrTag value here but rather always use latest b/c it's not yet properly implemented
export const createRpcExecutor = (
  chain: Chain,
  options: ChainOptions,
  walletManager: WalletManager,
): RPCExecutorType => {
  return {
    web3_clientVersion: () => options.chainName,
    net_version: () => options.chainId.toString(),

    // eth
    eth_chainId: () => numberToQuantity(options.chainId),
    eth_gasPrice: () => chain.getGasPrice(),
    eth_getBalance: ([address, blockTag]) => {
      return chain.getBalance(address, 'latest')
    },
    eth_blockNumber: () => chain.getBlockNumber(),
    eth_getCode: ([address, blockTag]) => chain.getCode(address, 'latest'),
    eth_getTransactionCount: ([address, _blockTag]) => chain.getTransactionCount(address, 'latest'),
    eth_getBlockByNumber: async ([blockTag, includeTransactions]) => {
      const block = await chain.getBlock('latest', false)
      return block as SafeBlock
    },
    // @TODO: as any b/c logs are not implemented properly right now...
    eth_getTransactionReceipt: ([txHash]) => chain.getTransactionReceipt(txHash) as any,
    eth_sendRawTransaction: ([signedTx]) => chain.sendTransaction(signedTx),
    eth_sendTransaction: async ([tx]) => {
      const { from, nonce: _nonce, gas: _gas, ...restTx } = tx
      const wallet = walletManager.getWalletForAddress(from)
      if (!wallet) {
        throw new BadRequestHttpError([`Can't sign tx. ${from} is not unlocked!`])
      }

      const nonce = _nonce ?? (await chain.getTransactionCount(from, 'latest'))
      const gas = _gas ?? numberToQuantity(90_000)

      const signedTx = makeHexData(await wallet.sign(toEthersTransaction({ ...restTx, gas, nonce })))

      return chain.sendTransaction(signedTx)
    },
    eth_call: ([tx, _blockTag]) => chain.call(tx, 'latest'),
    eth_estimateGas: ([tx]) => chain.estimateGas(tx),
    eth_getStorageAt: async ([address, pos, block]) => {
      const result = await chain.getStorageAt(address, pos, block)
      if (result === '0x') {
        return '0x00' as any
      }
      return result
    },
    eth_accounts: () => {
      return walletManager.getWallets().map(w => makeAddress(w.address))
    },
    eth_newBlockFilter: () => {
      return chain.createNewBlockFilter()
    },
    eth_getFilterChanges: ([filterId]) => {
      return chain.getFilterChanges(filterId)
    },
    eth_uninstallFilter: ([filterId]) => {
      return chain.uninstallFilter(filterId)
    },

    // ganache compatibility
    evm_increaseTime: ([n]) => {
      chain.skewClock(n)
      return numberToQuantity(chain.options.value.clockSkew)
    },
    miner_start: () => {
      chain.startAutoMining()
      return true
    },
    miner_stop: () => {
      chain.stopAutoMining()
      return true
    },
    evm_mine: async () => {
      await chain.mineBlock()
      return numberToQuantity(0)
    },
    evm_snapshot: async () => {
      return numberToQuantity(chain.makeSnapshot())
    },
    evm_revert: async ([_n]) => {
      const n = quantityToNumber(_n)
      console.log(`Reverting to ${n}`)
      chain.revertToSnapshot(n)
      return true as const
    },
  }
}
