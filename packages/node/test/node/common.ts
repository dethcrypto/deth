import { request, expect } from 'chai'

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
