import { expect } from 'chai'
import { utils } from 'ethers'

import { NodeCtx } from '../../../src/node/ctx'
import { TestChain } from '../../../src'
import { getOptionsWithDefaults } from '../../../src/TestChainOptions'
import { WalletManager } from '../../../src/WalletManager'
import { getApp } from '../../../src/node/node'
import { makeRpcCall, unwrapRpcResponse } from '../common'

describe('rpc -> getTransactionReceipt', () => {
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

  it('supports eth_getTransactionReceipt for not existing txs', async () => {
    const notExistingTx = '0x436a358b4f1bbca97516d1118f6d537748b8b8256e241bd0b2573e14e22841e8'

    const res = await makeRpcCall(app, 'eth_getTransactionReceipt', [notExistingTx])

    expect(res).to.have.status(200)
    expect(res.body.result).to.be.eq(null)
  })

  it('supports eth_getTransactionReceipt for existing txs', async () => {
    const [sender] = ctx.walletManager.getWallets()
    const recipient = ctx.walletManager.createEmptyWallet()

    const value = utils.parseEther('3.1415')
    const signedTx = await sender.sign({
      to: recipient.address,
      gasLimit: 1000000,
      gasPrice: 1,
      nonce: 0,
      value,
    })

    const txHashResponse = unwrapRpcResponse(await makeRpcCall(app, 'eth_sendRawTransaction', [signedTx]))

    const res = await makeRpcCall(app, 'eth_getTransactionReceipt', [txHashResponse])

    expect(res).to.have.status(200)
    expect(res.body.result).to.containSubset({
      blockNumber: '0x1',
      contractAddress: null,
      cumulativeGasUsed: '0x5208',
      from: sender.address.toLowerCase(),
      gasUsed: '0x5208',
      logs: [],
      logsBloom:
        '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
      status: '0x1',
      to: recipient.address.toLowerCase(),
      transactionIndex: '0x0',
    })
  })
})
