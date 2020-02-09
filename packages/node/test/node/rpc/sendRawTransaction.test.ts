import { expect } from 'chai'
import { ContractFactory } from 'ethers'

import { COUNTER_ABI, COUNTER_BYTECODE } from '../../contracts/Counter'
import { NodeCtx } from '../../../src/node/ctx'
import { makeRpcCall, unwrapRpcResponse, runRpcHarness } from '../common'
import { numberToQuantity } from '../../../src/primitives'

describe('rpc -> sendRawTransaction', () => {
  let app: Express.Application
  let ctx: NodeCtx
  beforeEach(async () => {
    ({ app, ctx } = await runRpcHarness())
  })

  it('supports contract deploys via eth_sendRawTransaction', async () => {
    const [sender] = ctx.walletManager.getWallets()

    const factory = new ContractFactory(COUNTER_ABI, COUNTER_BYTECODE, sender)
    const { data: deployData } = factory.getDeployTransaction(0)
    const signedTx = await sender.sign({
      data: deployData,
      gasLimit: 1000000,
      gasPrice: 1,
      nonce: 0,
    })

    const txHashResponse = unwrapRpcResponse(await makeRpcCall(app, 'eth_sendRawTransaction', [signedTx]))

    const res = await makeRpcCall(app, 'eth_getTransactionReceipt', [txHashResponse])

    expect(res).to.have.status(200)
    expect(res.body.result.contractAddress).to.not.be.null
    expect(res.body.result.to).to.be.null
  })

  it('multiple eth_sendRawTransaction should not throw an error', async () => {
    // NOTE: current impl runs rpc calls sequentially
    const [sender] = ctx.walletManager.getWallets()
    const recipient = ctx.walletManager.createEmptyWallet()

    const sendTx = () =>
      makeRpcCall(app, 'eth_sendTransaction', [
        {
          from: sender.address,
          gas: numberToQuantity(5_000_000),
          gasPrice: numberToQuantity(1_000_000_000),
          to: recipient.address,
          value: numberToQuantity(1_000),
        },
      ])

    const requests = await Promise.all(
      Array(5)
        .fill(5)
        .map(sendTx),
    )

    for (const request of requests) {
      await expect(request).to.have.status(200)
      expect(request.body.result).to.a('string')
    }
  })
})
