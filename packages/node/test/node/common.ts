import { request } from 'chai'

export function makeRpcCall (
  app: Express.Application,
  methodName: string,
  params: any[],
): Promise<ChaiHttp.Response> {
  return request(app)
    .post('/')
    .send({ jsonrpc: '2.0', method: methodName, params: params, id: 1 })
}
