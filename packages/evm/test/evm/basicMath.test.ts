import { expect } from 'chai'
import { executeAssembly } from './executeAssembly'
import { MachineWord } from '../../src/MachineWord'

describe('EVM - Basic math', () => {
  it('ADD', () => {
    const ctx = executeAssembly(`
      PUSH1 02
      PUSH1 01
      ADD
    `)
    const result = ctx.stack.pop()
    const expected = MachineWord.fromHexString('3')
    expect(result.equals(expected)).to.equal(true)
  })

  it('MUL', () => {
    const ctx = executeAssembly(`
      PUSH1 02
      PUSH1 03
      MUL
    `)
    const result = ctx.stack.pop()
    const expected = MachineWord.fromHexString('6')
    expect(result.equals(expected)).to.equal(true)
  })

  it('SUB', () => {
    const ctx = executeAssembly(`
      PUSH1 01
      PUSH1 02
      SUB
    `)
    const result = ctx.stack.pop()
    const expected = MachineWord.fromHexString('1')
    expect(result.equals(expected)).to.equal(true)
  })
})
