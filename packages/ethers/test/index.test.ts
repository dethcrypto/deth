import { expect } from 'chai'
import { add } from '../src'

describe('add', () => {
  it('can add two numbers', () => {
    expect(add(1, 2)).to.equal(3)
  })
})
