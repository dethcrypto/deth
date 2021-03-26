import { request, expect } from 'chai'
import { COUNTER_ABI, COUNTER_BYTECODE } from '../../contracts/Counter'
import { ContractFactory, Wallet, Contract } from 'ethers'
import { numberToQuantity } from '@dethnode/chain'
import { Application } from 'express'

export function makeRpcCall(
  app: Application,
  methodName: string,
  params: any[] = []
): Promise<ChaiHttp.Response> {
  return request(app)
    .post('/')
    .send({ jsonrpc: '2.0', method: methodName, params: params, id: 1 })
}

export function unwrapRpcResponse(response: ChaiHttp.Response): any {
  expect(response, 'Trying to unwrap unsuccessful RPC response').to.have.status(
    200
  )

  return response.body.result
}

export async function deployCounterContract(
  app: Application,
  sender: Wallet
): Promise<Contract> {
  const factory = new ContractFactory(COUNTER_ABI, COUNTER_BYTECODE, sender)
  const { data } = factory.getDeployTransaction(0)

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
