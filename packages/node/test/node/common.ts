import { request, expect } from 'chai'

import { TestChain } from '../../src/test-chain/TestChain'
import { WalletManager } from '../../src/WalletManager'
import { getApp } from '../../src/node/node'
import { NoopLogger } from '../debugger/Logger/NoopLogger'
import { NodeCtx } from '../../src/node/ctx'
import { AbiDecoder } from '../../src/debugger/AbiDecoder'
import { mockFs } from '../fs/fs.mock'
import { getConfigWithDefaults } from '../../src/config/config'
import { COUNTER_ABI, COUNTER_BYTECODE } from '../contracts/Counter'
import { ContractFactory, Wallet, Contract } from 'ethers'
import { numberToQuantity } from '../../src/test-chain/model'

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
  const logger = new NoopLogger()
  const abiDecoder = new AbiDecoder(mockFs())
  const chain = new TestChain(logger)
  await chain.init()
  const cfg = getConfigWithDefaults()
  const ctx: NodeCtx = {
    abiDecoder,
    chain,
    walletManager: new WalletManager(cfg.accounts.privateKeys),
    logger,
    cfg: cfg,
  }

  const app = getApp(ctx)

  return {
    app,
    ctx,
    chain,
  }
}

export async function deployCounterContract (app: Express.Application, sender: Wallet): Promise<Contract> {
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

  return new Contract(contractAddress, COUNTER_ABI, sender)
}
