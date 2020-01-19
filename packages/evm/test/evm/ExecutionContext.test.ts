import { expect } from 'chai'
import { ExecutionContext } from '../../src/evm/ExecutionContext'
import { OutOfGas } from '../../src/evm/errors'
import { Storage } from '../../src/evm/Storage'

describe('ExecutionContext', () => {
  function makeContext (gasLimit: number) {
    return new ExecutionContext([], {
      gasLimit,
      storage: new Storage(),
    })
  }

  it('can track gas usage', () => {
    const ctx = makeContext(Infinity)
    ctx.useGas(10)
    ctx.useGas(15)
    expect(ctx.getGasUsed()).to.equal(25)
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
    expect(ctx.getGasUsed()).to.equal(300)
  })

  it('can apply refund', () => {
    const ctx = makeContext(Infinity)
    ctx.useGas(100)
    ctx.addRefund(10)
    ctx.addRefund(15)
    ctx.applyRefund()
    expect(ctx.getGasUsed()).to.equal(75)
  })

  it('refund cannot exceed 50% gas used rounded down', () => {
    const ctx = makeContext(Infinity)
    ctx.useGas(101)
    ctx.addRefund(51)
    ctx.applyRefund()
    expect(ctx.getGasUsed()).to.equal(51)
  })
})
