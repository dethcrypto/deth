import { expect, request } from 'chai'
import { makeRpcCall, unwrapRpcResponse } from './common'
import { getApp } from '../../src/node/node'
import { TestChain, TestProvider } from '../../src'
import { CHAIN_ID } from '../../src/constants'
import { utils, ContractFactory } from 'ethers'
import { COUNTER_ABI, COUNTER_BYTECODE } from '../contracts/Counter'
import { NodeCtx } from '../../src/node/ctx'

describe('RPC', () => {
  let app: Express.Application
  let ctx: NodeCtx
  beforeEach(() => {
    const chain = new TestChain()
    ctx = {
      chain,
      provider: new TestProvider(chain),
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
    // this test could use other RPC call for sending tx but they are not implemented yet
    const provider = new TestProvider(ctx.chain)
    const [sender] = provider.getWallets()
    const recipient = provider.createEmptyWallet()

    const value = utils.parseEther('3.1415')
    await sender.sendTransaction({
      to: recipient.address,
      value,
    })

    const res = await makeRpcCall(app, 'eth_getBalance', [recipient.address, 'latest'])

    expect(res).to.have.status(200)
    expect(res.body.result).to.be.eq(value.toHexString())
  })

  it('supports eth_getBalance call for account with zero balance', async () => {
    const provider = new TestProvider(ctx.chain)
    const recipient = provider.createEmptyWallet()

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
    const provider = new TestProvider(ctx.chain)
    const [sender] = provider.getWallets()
    const recipient = provider.createEmptyWallet()

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
    const provider = new TestProvider(ctx.chain)
    const [sender] = provider.getWallets()

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
    const [sender] = ctx.provider.getWallets()
    const recipient = ctx.provider.createEmptyWallet()

    const request = await makeRpcCall(app, 'eth_sendTransaction', [
      {
        from: sender.address,
        gas: utils.bigNumberify(5_000_000).toHexString(),
        gasPrice: utils.bigNumberify(1_000_000_000).toHexString(),
        to: recipient.address,
        value: utils.bigNumberify(1_000_000_000).toHexString(),
      },
    ])

    expect(request).to.have.status(200)
    expect(request.body.result).to.a('string')
  })
})
