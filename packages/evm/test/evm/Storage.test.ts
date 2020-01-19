import { expect } from 'chai'
import { MachineWord } from '../../src/evm/MachineWord'
import { Storage } from '../../src/evm/Storage'

const A = MachineWord.ONE
const B = A.add(A)
const C = B.add(A)

describe('Storage', () => {
  it('defaults to zero for unknown keys', () => {
    const storage = new Storage()
    const result = storage.get(A)

    expect(result.equals(MachineWord.ZERO)).to.equal(true)
  })

  it('remembers set values', () => {
    const storage = new Storage()
    storage.set(A, B)
    const result = storage.get(A)

    expect(result.equals(B)).to.equal(true)
  })

  it('can store multiple values', () => {
    const storage = new Storage()
    storage.set(A, B)
    storage.set(B, C)
    storage.set(A, A)
    const resultA = storage.get(A)
    const resultB = storage.get(B)

    expect(resultA.equals(A)).to.equal(true)
    expect(resultB.equals(C)).to.equal(true)
  })

  it('can revert changes', () => {
    const storage = new Storage()
    storage.set(A, B)
    storage.set(B, C)

    storage.revert()

    const resultA = storage.get(A)
    const resultB = storage.get(B)

    expect(resultA.equals(MachineWord.ZERO)).to.equal(true)
    expect(resultB.equals(MachineWord.ZERO)).to.equal(true)
  })

  it('can commit changes', () => {
    const storage = new Storage()

    storage.set(A, B)
    storage.set(B, C)

    storage.commit()

    storage.set(A, C)
    storage.set(B, B)
    storage.set(C, A)

    storage.revert()

    const resultA = storage.get(A)
    const resultB = storage.get(B)
    const resultC = storage.get(C)

    expect(resultA.equals(B)).to.equal(true)
    expect(resultB.equals(C)).to.equal(true)
    expect(resultC.equals(MachineWord.ZERO)).to.equal(true)
  })
})
