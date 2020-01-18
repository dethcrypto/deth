import { expect } from 'chai'
import { Memory, GasAwareMemory } from '../../src/evm/Memory'
import { memoryGas } from './helpers'

describe('Memory', () => {
  it('starts with zero size', () => {
    const memory = new Memory()
    expect(memory.getSize()).to.equal(0)
  })

  it('expands size and pads it to 32 bytes', () => {
    const memory = new Memory()
    memory.setBytes(0, [0xAB, 0xCD])
    expect(memory.getSize()).to.equal(32)
    memory.setBytes(31, [0xAB, 0xCD])
    expect(memory.getSize()).to.equal(64)
  })

  it('expands filling space with zeroes', () => {
    const memory = new Memory()
    memory.setBytes(0, [0xAB, 0xCD])
    memory.setBytes(3, [0xEF])
    expect(memory.getBytes(0, 5)).to.deep.equal([0xAB, 0xCD, 0x00, 0xEF, 0x00])
  })

  it('getBytes results in memory expansion', () => {
    const memory = new Memory()
    const bytes = memory.getBytes(10, 1)
    expect(bytes).to.deep.equal([0x00])
    expect(memory.getSize()).to.equal(32)
  })

  it('zero length getBytes does not expand the memory', () => {
    const memory = new Memory()
    const bytes = memory.getBytes(10_000, 0)
    expect(bytes).to.deep.equal([])
    expect(memory.getSize()).to.equal(0)
  })

  it('zero length setBytes does not expand the memory', () => {
    const memory = new Memory()
    memory.setBytes(10_000, [])
    expect(memory.getSize()).to.equal(0)
  })
})

describe('GasAwareMemory', () => {
  let gasUsed = 0
  const useGas = (gas: number) => {
    gasUsed += gas
  }

  beforeEach(() => {
    gasUsed = 0
  })

  it('can track a single memory usage', () => {
    const memory = new GasAwareMemory(new Memory(), useGas)
    memory.getBytes(300, 1)
    expect(gasUsed).to.equal(memoryGas(301))
  })

  it('does not use any gas on zero length access', () => {
    const memory = new GasAwareMemory(new Memory(), useGas)
    memory.getBytes(31415, 0)
    expect(gasUsed).to.equal(0)
  })

  it('can track multiple memory uses', () => {
    const memory = new GasAwareMemory(new Memory(), useGas)
    memory.getBytes(0, 100)
    memory.getBytes(9_000, 2_000)
    memory.getBytes(15_000_000, 3)
    memory.getBytes(11, 12)
    expect(gasUsed).to.equal(memoryGas(15_000_003))
  })

  it('tracks memory use for setBytes', () => {
    const memory = new GasAwareMemory(new Memory(), useGas)
    memory.setBytes(300, [0xBA])
    expect(gasUsed).to.equal(memoryGas(301))
  })

  it('forwards getSize', () => {
    const memory = new GasAwareMemory(new Memory(), useGas)
    memory.setBytes(300, [0xBA])
    const size = memory.getSize()
    expect(size).to.equal(Math.ceil(301 / 32) * 32)
  })
})
