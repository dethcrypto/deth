import { expect } from 'chai'
import { ExecutionContext } from '../../src/evm/ExecutionContext'
import { OutOfGas } from '../../src/evm/errors'
import { DEFAULT_MESSAGE } from './helpers'

describe('ExecutionContext', () => {
  function makeContext (gasLimit: number) {
    return new ExecutionContext({
      ...DEFAULT_MESSAGE,
      gasLimit,
    })
  }

  it('can track gas usage', () => {
    const ctx = makeContext(Infinity)
    ctx.useGas(10)
    ctx.useGas(15)
    expect(ctx.gasUsed).to.equal(25)
  })

  it('throws when too much gas is used', () => {
    const ctx = makeContext(100)
    ctx.useGas(10)
    ctx.useGas(90)
    expect(() => ctx.useGas(1)).to.throw(OutOfGas)
  })

  it('can use all gas', () => {
    const ctx = makeContext(300)
    ctx.useRemainingGas()
    expect(ctx.gasUsed).to.equal(300)
  })

  it('can track refund', () => {
    const ctx = makeContext(Infinity)
    ctx.useGas(100)
    ctx.refund(10)
    ctx.refund(15)
    expect(ctx.gasUsed).to.equal(100)
    expect(ctx.gasRefund).to.equal(25)
  })
})
