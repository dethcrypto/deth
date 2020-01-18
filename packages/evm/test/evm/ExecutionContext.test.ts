import { expect } from 'chai'
import { ExecutionContext } from '../../src/evm/ExecutionContext'
import { OutOfGas } from '../../src/evm/errors'

describe('ExecutionContext', () => {
  it('can track gas usage', () => {
    const ctx = new ExecutionContext([], Infinity)
    ctx.useGas(10)
    ctx.useGas(15)
    expect(ctx.getGasUsed()).to.equal(25)
  })

  it('throws when too much gas is used', () => {
    const ctx = new ExecutionContext([], 100)
    ctx.useGas(10)
    ctx.useGas(90)
    expect(() => ctx.useGas(1)).to.throw(OutOfGas)
  })

  it('can use all gas', () => {
    const ctx = new ExecutionContext([], 300)
    ctx.useRemainingGas()
    expect(ctx.getGasUsed()).to.equal(300)
  })
})
