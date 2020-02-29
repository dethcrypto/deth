import { expect } from 'chai'

import { makeRpcCall, unwrapRpcResponse } from '../../common'
import { buildTestApp } from '../../buildTestApp'
import { numberToQuantity } from '@deth/chain'

describe('rpc -> miningControl', () => {
  it('stops mining', async () => {
    const app = await buildTestApp()
    const [sender] = app.services.walletManager.getWallets()
    const recipient = app.services.walletManager.createEmptyWallet()

    unwrapRpcResponse(await makeRpcCall(app, 'miner_stop'))

    const txHash = unwrapRpcResponse(
      await makeRpcCall(app, 'eth_sendTransaction', [
        {
          from: sender.address,
          gas: numberToQuantity(5_000_000),
          gasPrice: numberToQuantity(1_000_000_000),
          to: recipient.address,
          value: numberToQuantity(1_000),
        },
      ]),
    )

    const receipt = unwrapRpcResponse(await makeRpcCall(app, 'eth_getTransactionReceipt', [txHash]))

    expect(receipt).to.be.null // b/c its not mined
  })

  it('allows to mine manually', async () => {
    const app = await buildTestApp()
    const [sender] = app.services.walletManager.getWallets()
    const recipient = app.services.walletManager.createEmptyWallet()

    unwrapRpcResponse(await makeRpcCall(app, 'miner_stop'))

    const txHash = unwrapRpcResponse(
      await makeRpcCall(app, 'eth_sendTransaction', [
        {
          from: sender.address,
          gas: numberToQuantity(5_000_000),
          gasPrice: numberToQuantity(1_000_000_000),
          to: recipient.address,
          value: numberToQuantity(1_000),
        },
      ]),
    )

    const receipt = unwrapRpcResponse(await makeRpcCall(app, 'eth_getTransactionReceipt', [txHash]))
    expect(receipt).to.be.null // b/c its not mined

    unwrapRpcResponse(await makeRpcCall(app, 'evm_mine'))

    const realReceipt = unwrapRpcResponse(await makeRpcCall(app, 'eth_getTransactionReceipt', [txHash]))
    expect(realReceipt).to.be.not.null
  })

  it('re-starts mining', async () => {
    const app = await buildTestApp()
    const [sender] = app.services.walletManager.getWallets()
    const recipient = app.services.walletManager.createEmptyWallet()

    unwrapRpcResponse(await makeRpcCall(app, 'miner_stop'))
    unwrapRpcResponse(await makeRpcCall(app, 'miner_start'))

    const txHash = unwrapRpcResponse(
      await makeRpcCall(app, 'eth_sendTransaction', [
        {
          from: sender.address,
          gas: numberToQuantity(5_000_000),
          gasPrice: numberToQuantity(1_000_000_000),
          to: recipient.address,
          value: numberToQuantity(1_000),
        },
      ]),
    )

    const receipt = unwrapRpcResponse(await makeRpcCall(app, 'eth_getTransactionReceipt', [txHash]))
    expect(receipt).to.be.not.null // b/c its not mined
  })

  it('respects snapshots', async () => {
    const app = await buildTestApp()
    const [sender] = app.services.walletManager.getWallets()
    const recipient = app.services.walletManager.createEmptyWallet()

    unwrapRpcResponse(await makeRpcCall(app, 'miner_stop'))
    const snapshotId = unwrapRpcResponse(await makeRpcCall(app, 'evm_snapshot'))
    unwrapRpcResponse(await makeRpcCall(app, 'miner_start'))
    unwrapRpcResponse(await makeRpcCall(app, 'evm_revert', [snapshotId]))

    const txHash = unwrapRpcResponse(
      await makeRpcCall(app, 'eth_sendTransaction', [
        {
          from: sender.address,
          gas: numberToQuantity(5_000_000),
          gasPrice: numberToQuantity(1_000_000_000),
          to: recipient.address,
          value: numberToQuantity(1_000),
        },
      ]),
    )

    const receipt = unwrapRpcResponse(await makeRpcCall(app, 'eth_getTransactionReceipt', [txHash]))

    expect(receipt).to.be.null // b/c its not mined
  })
})
