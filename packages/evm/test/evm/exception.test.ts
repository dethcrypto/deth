import { expect } from 'chai'
import { executeAssembly } from './helpers'
import { InvalidOpcode } from '../../src/evm/errors'
import { Storage } from '../../src/evm/Storage'
import { MachineWord } from '../../src/evm/MachineWord'

describe('When an exception occurs', () => {
  it('all gas is used', () => {
    const result = executeAssembly('INVALID', { gasLimit: 1_000_000 })

    expect(result.error).to.be.instanceOf(InvalidOpcode)
    expect(result.gasUsed).to.equal(1_000_000)
  })

  it('state changes are reverted', () => {
    const storage = new Storage()
    storage.set(MachineWord.ZERO, MachineWord.ONE)

    const assembly = `
      PUSH1 02
      PUSH1 00
      SSTORE
      PUSH1 03
      PUSH1 01
      SSTORE
      INVALID
    `
    const result = executeAssembly(assembly, { storage })

    expect(result.error).to.be.instanceOf(InvalidOpcode)
    const storageAt0 = result.storage.get(MachineWord.ZERO)
    const storageAt1 = result.storage.get(MachineWord.ONE)
    expect(storageAt0.equals(MachineWord.ONE)).to.equal(true)
    expect(storageAt1.equals(MachineWord.ZERO)).to.equal(true)
  })
})
