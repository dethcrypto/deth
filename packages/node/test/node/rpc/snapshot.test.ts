import { expect } from 'chai'

import { NodeCtx } from '../../../src/node/ctx'
import { makeRpcCall, unwrapRpcResponse, runRpcHarness, deployCounterContract } from '../common'
import { numberToQuantity } from '@deth/chain'

describe('rpc -> snapshot', () => {
  let app: Express.Application
  let ctx: NodeCtx
  beforeEach(async () => {
    ({ app, ctx } = await runRpcHarness())
  })

  it('support evm_snapshots', async () => {
    const [sender] = ctx.walletManager.getWallets()

    const snapshotId = unwrapRpcResponse(await makeRpcCall(app, 'evm_snapshot'))

    const contract = await deployCounterContract(app, sender)

    const incrementCallData = contract.interface.functions.increment.encode([1])
    const incrementRequest = await makeRpcCall(app, 'eth_sendTransaction', [
      {
        data: incrementCallData,
        from: sender.address,
        to: contract.address,
        gas: numberToQuantity(5_000_000),
        gasPrice: numberToQuantity(1_000_000_000),
      },
      'latest',
    ])
    expect(incrementRequest).to.have.status(200)
    expect(incrementRequest.body.result).to.a('string')

    const valueCallData = contract.interface.functions.value.encode([])
    const valueRequest = await makeRpcCall(app, 'eth_call', [
      {
        data: valueCallData,
        from: sender.address,
        to: contract.address,
        gas: numberToQuantity(5_000_000),
        gasPrice: numberToQuantity(1_000_000_000),
      },
      'latest',
    ])
    expect(valueRequest).to.have.status(200)
    // note: this probably is wrong... it should be just encoded as 0x0?
    expect(valueRequest.body.result).to.eq('0x0000000000000000000000000000000000000000000000000000000000000001')

    const revertResponse = await makeRpcCall(app, 'evm_revert', [snapshotId])
    expect(revertResponse).to.have.status(200)

    const valueAfterRevert = unwrapRpcResponse(
      await makeRpcCall(app, 'eth_call', [
        {
          data: '0x3fa4f245',
          from: sender.address,
          to: '0xd36ec1a54c6fba5b74e79f3cedce04f9685399f9',
          gas: numberToQuantity(5_000_000),
          gasPrice: numberToQuantity(1_000_000_000),
        },
        'latest',
      ]),
    )
    expect(valueAfterRevert).to.eq('0x')
    const codeAfterRevert = unwrapRpcResponse(
      await makeRpcCall(app, 'eth_getCode', ['0xd36ec1a54c6fba5b74e79f3cedce04f9685399f9', 'latest']),
    )
    expect(codeAfterRevert).to.eq('0x')
  })
})
