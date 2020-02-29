import { expect } from 'chai'

import { NodeCtx } from '../../../src/node/ctx'
import { makeRpcCall, unwrapRpcResponse, runRpcHarness } from '../common'
import { numberToQuantity, quantityToNumber } from '@deth/chain'
import sinon from 'sinon'

describe('rpc -> time control', () => {
  let app: Express.Application
  let ctx: NodeCtx
  let clock: sinon.SinonFakeTimers
  beforeEach(async () => {
    ;({ app, ctx } = await runRpcHarness())
    clock = sinon.useFakeTimers(0)
  })

  afterEach(() => {
    clock.restore()
  })

  it('changes time', async () => {
    const [sender] = ctx.walletManager.getWallets()
    const recipient = ctx.walletManager.createEmptyWallet()
    const clockSkew = 1000

    unwrapRpcResponse(await makeRpcCall(app, 'evm_increaseTime', [clockSkew]))

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
    const block = unwrapRpcResponse(await makeRpcCall(app, 'eth_getBlockByNumber', [receipt.blockNumber, false]))

    const blockTimestamp = quantityToNumber(block.timestamp)
    expect(blockTimestamp).to.eq(clockSkew)
  })

  it('respects snapshots', async () => {
    const [sender] = ctx.walletManager.getWallets()
    const recipient = ctx.walletManager.createEmptyWallet()
    const clockSkew = 1000

    unwrapRpcResponse(await makeRpcCall(app, 'evm_increaseTime', [clockSkew]))
    const snapshotId = unwrapRpcResponse(await makeRpcCall(app, 'evm_snapshot'))
    unwrapRpcResponse(await makeRpcCall(app, 'evm_increaseTime', [1234]))
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
    const block = unwrapRpcResponse(await makeRpcCall(app, 'eth_getBlockByNumber', [receipt.blockNumber, false]))

    const blockTimestamp = quantityToNumber(block.timestamp)
    expect(blockTimestamp).to.eq(clockSkew)
  })
})
