import { request, expect } from 'chai'
import { runRpcHarness } from './common'

describe('HTTP/errors', () => {
  let app: Express.Application
  beforeEach(async () => {
    ({ app } = await runRpcHarness())
  })

  it('throws error when calling non existing endpoints', async () => {
    const res = await request(app)
      .get('/not-existing')
      .send({})

    expect(res).to.have.status(404)
    expect(res.body.error.status).to.be.deep.eq(404)
  })
})
