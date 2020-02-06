import { expect } from 'chai'

import { NodeCtx } from '../../../src/node/ctx'
import { TestChain } from '../../../src'
import { getOptionsWithDefaults } from '../../../src/TestChainOptions'
import { WalletManager } from '../../../src/WalletManager'
import { getApp } from '../../../src/node/node'
import { makeRpcCall } from '../common'
import { numberToQuantity } from '../../../src/primitives'

describe('rpc -> sendTransaction', () => {
  let app: Express.Application
  let ctx: NodeCtx
  beforeEach(async () => {
    const chain = new TestChain()
    await chain.init()
    const options = getOptionsWithDefaults()
    ctx = {
      chain,
      walletManager: new WalletManager(chain.options.privateKeys),
      options,
    }

    app = getApp(ctx)
  })

  it('supports eth_sendTransaction', async () => {
    const [sender] = ctx.walletManager.getWallets()
    const recipient = ctx.walletManager.createEmptyWallet()

    const request = await makeRpcCall(app, 'eth_sendTransaction', [
      {
        from: sender.address,
        gas: numberToQuantity(5_000_000),
        gasPrice: numberToQuantity(1_000_000_000),
        to: recipient.address,
        value: numberToQuantity(1_000),
      },
    ])

    expect(request).to.have.status(200)
    expect(request.body.result).to.a('string')
  })

  it('supports eth_sendTransaction with optional values', async () => {
    const [sender] = ctx.walletManager.getWallets()
    const recipient = ctx.walletManager.createEmptyWallet()

    const request = await makeRpcCall(app, 'eth_sendTransaction', [
      {
        from: sender.address,
        gas: numberToQuantity(5_000_000),
        // note: gasLimit is totally missing ie undefined
        to: recipient.address,
        // note: data is passed as null
        data: null,
      },
    ])

    expect(request).to.have.status(200)
    expect(request.body.result).to.a('string')
  })

  it('supports eth_sendTransaction with missing nonce', async () => {
    const [sender] = ctx.walletManager.getWallets()
    const recipient = ctx.walletManager.createEmptyWallet()

    const request1 = await makeRpcCall(app, 'eth_sendTransaction', [
      {
        from: sender.address,
        gas: numberToQuantity(5_000_000),
        // note: gasLimit is totally missing ie undefined
        to: recipient.address,
        // note: data is passed as null
        data: null,
      },
    ])
    expect(request1).to.have.status(200)
    expect(request1.body.result).to.a('string')

    const request2 = await makeRpcCall(app, 'eth_sendTransaction', [
      {
        from: sender.address,
        gas: numberToQuantity(5_000_000),
        // note: gasLimit is totally missing ie undefined
        to: recipient.address,
        // note: data is passed as null
        data: null,
      },
    ])
    expect(request2).to.have.status(200)
    expect(request2.body.result).to.a('string')
  })
  // this should already work but test is missing
  xit('supports eth_sendTransaction with explicit nonce')
  xit('supports eth_sendTransaction with default gas')
})
