import { expect } from 'chai'

import { NodeCtx } from '../../../src/node/ctx'
import { makeRpcCall, unwrapRpcResponse, runRpcHarness } from '../common'
import { numberToQuantity } from '../../../src/primitives'

describe('rpc -> miningControl', () => {
  let app: Express.Application
  let ctx: NodeCtx
  beforeEach(async () => {
    ;({ app, ctx } = await runRpcHarness())
  })

  it('stops mining', async () => {
    const [sender] = ctx.walletManager.getWallets()
    const recipient = ctx.walletManager.createEmptyWallet()

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
    const [sender] = ctx.walletManager.getWallets()
    const recipient = ctx.walletManager.createEmptyWallet()

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
    const [sender] = ctx.walletManager.getWallets()
    const recipient = ctx.walletManager.createEmptyWallet()

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
    const [sender] = ctx.walletManager.getWallets()
    const recipient = ctx.walletManager.createEmptyWallet()

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
