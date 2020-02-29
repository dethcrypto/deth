import { expect } from 'chai'
import { ContractFactory } from 'ethers'

import { COUNTER_ABI, COUNTER_BYTECODE } from '../../contracts/Counter'
import { makeRpcCall, unwrapRpcResponse } from '../../common'
import { buildTestApp } from '../../buildTestApp'
import { numberToQuantity } from '@deth/chain'

describe('rpc -> sendRawTransaction', () => {
  it('supports contract deploys via eth_sendRawTransaction', async () => {
    const app = await buildTestApp()
    const [sender] = app.services.walletManager.getWallets()

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
    const app = await buildTestApp()
    const [sender] = app.services.walletManager.getWallets()
    const recipient = app.services.walletManager.createEmptyWallet()

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
      expect(request).to.have.status(200)
      expect(request.body.result).to.a('string')
    }
  })
})
