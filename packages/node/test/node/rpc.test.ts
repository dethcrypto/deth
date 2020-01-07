import { expect, request } from 'chai'
import { makeRpcCall, unwrapRpcResponse } from './common'
import { getApp } from '../../src/node/node'
import { TestChain } from '../../src'
import { CHAIN_ID } from '../../src/constants'
import { utils, ContractFactory } from 'ethers'
import { COUNTER_ABI, COUNTER_BYTECODE } from '../contracts/Counter'
import { NodeCtx } from '../../src/node/ctx'
import { numberToQuantity } from '../../src/primitives'
import { WalletManager } from '../../src/WalletManager'

describe('RPC', () => {
  let app: Express.Application
  let ctx: NodeCtx
  beforeEach(() => {
    const chain = new TestChain()
    ctx = {
      chain,
      walletManager: new WalletManager(chain.options.privateKeys),
    }

    app = getApp(ctx)
  })

  it('supports json envelope with ids as numbers', async () => {
    const res = await request(app)
      .post('/')
      .send({ jsonrpc: '2.0', method: 'net_version', params: [], id: 1 })

    expect(res).to.have.status(200)
  })

  it('supports json envelope with ids as strings', async () => {
    const res = await request(app)
      .post('/')
      .send({ jsonrpc: '2.0', method: 'net_version', params: [], id: '1' })

    expect(res).to.have.status(200)
  })

  it('supports net_version call', async () => {
    const res = await makeRpcCall(app, 'net_version', [])

    expect(res).to.have.status(200)
    expect(res.body.result).to.be.eq(CHAIN_ID.toString())
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

  xit('supports eth_call calling smartcontracts')
  // next test probably can be removed after writing proper test 1) deploying sc 2) calling it
  it('supports eth_call', async () => {
    const recipient = ctx.walletManager.createEmptyWallet()

    const request = await makeRpcCall(app, 'eth_call', [
      {
        gas: numberToQuantity(5_000_000),
        gasPrice: numberToQuantity(1_000_000_000),
        to: recipient.address,
      },
      'latest',
    ])

    expect(request).to.have.status(200)
    expect(request.body.result).to.a('string')
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
