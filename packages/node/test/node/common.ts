import { request, expect } from 'chai'
import { TestChain } from '../../src/TestChain'
import { getOptionsWithDefaults } from '../../src/TestChainOptions'
import { WalletManager } from '../../src/WalletManager'
import { getApp } from '../../src/node/node'

export function makeRpcCall (
  app: Express.Application,
  methodName: string,
  params: any[] = [],
): Promise<ChaiHttp.Response> {
  return request(app)
    .post('/')
    .send({ jsonrpc: '2.0', method: methodName, params: params, id: 1 })
}

export function unwrapRpcResponse (response: ChaiHttp.Response): any {
  expect(response, 'Trying to unwrap unsuccessful RPC response').to.have.status(200)

  return response.body.result
}

export async function runRpcHarness () {
  const chain = new TestChain()
  await chain.init()
  const options = getOptionsWithDefaults()
  const ctx = {
    chain,
    walletManager: new WalletManager(chain.options.value.privateKeys),
    options,
  }

  const app = getApp(ctx)

  return {
    app,
    ctx,
    chain,
  }
}
