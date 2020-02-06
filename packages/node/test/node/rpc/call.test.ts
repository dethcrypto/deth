import { expect } from 'chai'
import { ContractFactory, Contract } from 'ethers'

import { COUNTER_ABI, COUNTER_BYTECODE } from '../../contracts/Counter'
import { NodeCtx } from '../../../src/node/ctx'
import { TestChain } from '../../../src'
import { getOptionsWithDefaults } from '../../../src/TestChainOptions'
import { WalletManager } from '../../../src/WalletManager'
import { getApp } from '../../../src/node/node'
import { makeRpcCall } from '../common'
import { numberToQuantity } from '../../../src/primitives'

describe('rpc -> call', () => {
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

  xit('supports eth_call calling smartcontracts')

  it('supports eth_call', async () => {
    const [sender] = ctx.walletManager.getWallets()

    const factory = new ContractFactory(COUNTER_ABI, COUNTER_BYTECODE, sender)
    const { data } = await factory.getDeployTransaction(0)

    const {
      body: { result: txHash },
    } = await makeRpcCall(app, 'eth_sendTransaction', [
      {
        data,
        from: sender.address,
        gas: numberToQuantity(5_000_000),
        gasPrice: numberToQuantity(1_000_000_000),
      },
      'latest',
    ])
    const {
      body: {
        result: { contractAddress },
      },
    } = await makeRpcCall(app, 'eth_getTransactionReceipt', [txHash])

    expect(contractAddress).to.be.a('string')

    const contract = new Contract(contractAddress, COUNTER_ABI, sender)

    const incrementCallData = contract.interface.functions.increment.encode([1])
    const incrementRequest = await makeRpcCall(app, 'eth_sendTransaction', [
      {
        data: incrementCallData,
        from: sender.address,
        to: contractAddress,
        gas: numberToQuantity(5_000_000),
        gasPrice: numberToQuantity(1_000_000_000),
      },
      'latest',
    ])
    expect(incrementRequest).to.have.status(200)
    expect(incrementRequest.body.result).to.a('string')

    const statusCallData = contract.interface.functions.value.encode([])
    const statusRequest = await makeRpcCall(app, 'eth_call', [
      {
        data: statusCallData,
        from: sender.address,
        to: contractAddress,
        gas: numberToQuantity(5_000_000),
        gasPrice: numberToQuantity(1_000_000_000),
      },
      'latest',
    ])
    expect(statusRequest).to.have.status(200)
    // note: this probably is wrong... it should be just encoded as 0x01?
    expect(statusRequest.body.result).to.eq('0x0000000000000000000000000000000000000000000000000000000000000001')
  })
})
