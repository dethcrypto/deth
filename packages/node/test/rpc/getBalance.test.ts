import { expect } from 'chai'
import { utils } from 'ethers'

import { NodeCtx } from '../../src/ctx'
import { makeRpcCall, runRpcHarness } from '../common'
import { numberToQuantity } from '@deth/chain'

describe('rpc -> getBalance', () => {
  let app: Express.Application
  let ctx: NodeCtx
  beforeEach(async () => {
    ({ app, ctx } = await runRpcHarness())
  })

  it('supports eth_getBalance call for account with non-zero balance', async () => {
    const [sender] = ctx.walletManager.getWallets()
    const recipient = ctx.walletManager.createEmptyWallet()

    const value = utils.parseEther('3.1415')
    await makeRpcCall(app, 'eth_sendTransaction', [
      {
        from: sender.address,
        gas: numberToQuantity(5_000_000),
        to: recipient.address,
        value: value.toHexString(),
      },
    ])

    const res = await makeRpcCall(app, 'eth_getBalance', [recipient.address, 'latest'])

    expect(res).to.have.status(200)
    expect(res.body.result).to.be.eq(value.toHexString())
  })

  it('supports eth_getBalance call for account with zero balance', async () => {
    const recipient = ctx.walletManager.createEmptyWallet()

    const res = await makeRpcCall(app, 'eth_getBalance', [recipient.address, 'latest'])

    expect(res).to.have.status(200)
    expect(res.body.result).to.be.eq('0x0')
  })
})
