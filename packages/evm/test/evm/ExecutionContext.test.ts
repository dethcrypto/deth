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

  describe('useMemory', () => {
    const expectedGas = (bytes: number) => expectedGasFromWords(Math.ceil(bytes / 32))
    const expectedGasFromWords = (words: number) => words * 3 + Math.floor(words * words / 512)

    it('can track a single memory usage', () => {
      const ctx = new ExecutionContext([], Infinity)
      ctx.useMemory(0, 100)
      expect(ctx.getGasUsed()).to.equal(expectedGas(100))
    })

    it('does not use any gas on zero length access', () => {
      const ctx = new ExecutionContext([], Infinity)
      ctx.useMemory(31415, 0)
      expect(ctx.getGasUsed()).to.equal(0)
    })

    it('can track multiple memory uses', () => {
      const ctx = new ExecutionContext([], Infinity)
      ctx.useMemory(0, 100)
      ctx.useMemory(9_000, 2_000)
      ctx.useMemory(15_000_000, 3)
      ctx.useMemory(11, 12)
      expect(ctx.getGasUsed()).to.equal(expectedGas(15_000_003))
    })
  })
})
