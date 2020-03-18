import { expect } from 'chai'
import { Memory } from '../src/Memory'
import { memoryGas } from './helpers'
import { Bytes } from '../src/Bytes'

describe('Memory', () => {
  let gasUsed = 0
  const useGas = (gas: number) => {
    gasUsed += gas
  }

  beforeEach(() => {
    gasUsed = 0
  })

  it('starts with zero size', () => {
    const memory = new Memory(useGas)
    expect(memory.getSize()).to.equal(0)
  })

  it('expands size and pads it to 32 bytes', () => {
    const memory = new Memory(useGas)
    memory.setBytes(0, Bytes.fromString('abcd'))
    expect(memory.getSize()).to.equal(32)
    memory.setBytes(31, Bytes.fromString('abcd'))
    expect(memory.getSize()).to.equal(64)
  })

  it('expands filling space with zeroes', () => {
    const memory = new Memory(useGas)
    memory.setBytes(0, Bytes.fromString('abcd'))
    memory.setBytes(3, Bytes.fromString('ef'))
    expect(memory.getBytes(0, 5)).to.deep.equal(Bytes.fromString('ABCD00EF00'))
  })

  it('getBytes results in memory expansion', () => {
    const memory = new Memory(useGas)
    const bytes = memory.getBytes(10, 1)
    expect(bytes).to.deep.equal(Bytes.fromString('00'))
    expect(memory.getSize()).to.equal(32)
  })

  it('zero length getBytes does not expand the memory', () => {
    const memory = new Memory(useGas)
    const bytes = memory.getBytes(10_000, 0)
    expect(bytes).to.deep.equal(Bytes.EMPTY)
    expect(memory.getSize()).to.equal(0)
  })

  it('zero length setBytes does not expand the memory', () => {
    const memory = new Memory(useGas)
    memory.setBytes(10_000, Bytes.EMPTY)
    expect(memory.getSize()).to.equal(0)
  })

  describe('gas usage', () => {
    it('can track a single memory usage', () => {
      const memory = new Memory(useGas)
      memory.getBytes(300, 1)
      expect(gasUsed).to.equal(memoryGas(301))
    })

    it('does not use any gas on zero length access', () => {
      const memory = new Memory(useGas)
      memory.getBytes(31415, 0)
      expect(gasUsed).to.equal(0)
    })

    it('can track multiple memory uses', () => {
      const memory = new Memory(useGas)
      memory.getBytes(0, 100)
      memory.getBytes(9_000, 2_000)
      memory.getBytes(15_000_000, 3)
      memory.getBytes(11, 12)
      expect(gasUsed).to.equal(memoryGas(15_000_003))
    })

    it('tracks memory use for setBytes', () => {
      const memory = new Memory(useGas)
      memory.setBytes(300, Bytes.fromString('ba'))
      expect(gasUsed).to.equal(memoryGas(301))
    })

    it('forwards getSize', () => {
      const memory = new Memory(useGas)
      memory.setBytes(300, Bytes.fromString('ba'))
      const size = memory.getSize()
      expect(size).to.equal(Math.ceil(301 / 32) * 32)
    })
  })
})
