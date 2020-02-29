import { request, expect } from 'chai'
import { buildTestApp } from '../../buildTestApp'

describe('HTTP/errors', () => {
  it('throws error when calling non existing endpoints', async () => {
    const app = await buildTestApp()
    const res = await request(app).get('/not-existing')

    expect(res).to.have.status(404)
    expect(res.body.error.status).to.be.deep.eq(404)
  })
})
