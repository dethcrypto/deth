import { expect } from 'chai'
import { buildTestApp } from '../../buildTestApp'
import { getPage } from './utils'

describe('Explorer /explorer', () => {
  it('Returns a welcome message', async () => {
    const app = await buildTestApp()
    const $ = await getPage(app, '/explorer')

    expect($('body').text()).to.include('Hello Explorer!')
  })
})
