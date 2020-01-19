import { expect } from 'chai'
import { ExecutionContext } from '../../src/evm/ExecutionContext'
import { OutOfGas } from '../../src/evm/errors'
import { Storage } from '../../src/evm/Storage'

describe('ExecutionContext', () => {
  it('can track gas usage', () => {
    const ctx = new ExecutionContext([], {
      gasLimit: Infinity,
      storage: new Storage(),
    })
    ctx.useGas(10)
    ctx.useGas(15)
    expect(ctx.getGasUsed()).to.equal(25)
  })

  it('throws when too much gas is used', () => {
    const ctx = new ExecutionContext([], {
      gasLimit: 100,
      storage: new Storage(),
    })
    ctx.useGas(10)
    ctx.useGas(90)
    expect(() => ctx.useGas(1)).to.throw(OutOfGas)
  })

  it('can use all gas', () => {
    const ctx = new ExecutionContext([], {
      gasLimit: 300,
      storage: new Storage(),
    })
    ctx.useRemainingGas()
    expect(ctx.getGasUsed()).to.equal(300)
  })
})
