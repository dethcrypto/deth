import { expect } from 'chai'

import { makeRpcCall, unwrapRpcResponse } from '../../common'
import { buildTestApp } from '../../buildTestApp'
import { numberToQuantity, quantityToNumber } from '@deth/chain'
import sinon from 'sinon'

describe('rpc -> time control', () => {
  let clock: sinon.SinonFakeTimers
  beforeEach(async () => {
    clock = sinon.useFakeTimers(0)
  })

  afterEach(() => {
    clock.restore()
  })

  it('changes time', async () => {
    const app = await buildTestApp()
    const [sender] = app.services.walletManager.getWallets()
    const recipient = app.services.walletManager.createEmptyWallet()
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
    const app = await buildTestApp()
    const [sender] = app.services.walletManager.getWallets()
    const recipient = app.services.walletManager.createEmptyWallet()
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
