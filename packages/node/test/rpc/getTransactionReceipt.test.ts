import { expect } from 'chai'

import { makeRpcCall, unwrapRpcResponse, deployCounterContract } from '../common'
import { buildTestApp } from '../buildTestApp'
import { numberToQuantity } from '@deth/chain'

describe('rpc -> getTransactionReceipt', () => {
  it('supports eth_getTransactionReceipt for not existing txs', async () => {
    const app = await buildTestApp()
    const notExistingTx = '0x436a358b4f1bbca97516d1118f6d537748b8b8256e241bd0b2573e14e22841e8'

    const res = await makeRpcCall(app, 'eth_getTransactionReceipt', [notExistingTx])

    expect(res).to.have.status(200)
    expect(res.body.result).to.be.eq(null)
  })

  it('supports eth_getTransactionReceipt for existing txs', async () => {
    const app = await buildTestApp()
    const [sender] = app.services.walletManager.getWallets()

    const contract = await deployCounterContract(app, sender)

    const incrementCallData = contract.interface.functions.increment.encode([1])
    const txReceipt = unwrapRpcResponse(
      await makeRpcCall(app, 'eth_sendTransaction', [
        {
          data: incrementCallData,
          from: sender.address,
          to: contract.address,
          gas: numberToQuantity(5_000_000),
          gasPrice: numberToQuantity(1_000_000_000),
        },
        'latest',
      ]),
    )

    const res = unwrapRpcResponse(await makeRpcCall(app, 'eth_getTransactionReceipt', [txReceipt]))

    expect(res).to.containSubset({
      blockNumber: '0x2',
      contractAddress: null,
      cumulativeGasUsed: '0xa7f0',
      from: sender.address.toLowerCase(),
      gasUsed: '0xa7f0',
      logs: [
        {
          blockNumber: '0x2',
          logIndex: '0x0',
          transactionIndex: '0x0',
          data: '0x0000000000000000000000000000000000000000000000000000000000000001',
          topics: ['0x51af157c2eee40f68107a47a49c32fbbeb0a3c9e5cd37aa56e88e6be92368a81'],
        },
      ],
      logsBloom:
        '0x00000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000004000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000200000000000000000000000000000000',
      status: '0x1',
      to: contract.address.toLowerCase(),
      transactionIndex: '0x0',
    })
  })
})
