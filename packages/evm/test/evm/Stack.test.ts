import { expect } from 'chai'
import { MachineWord } from '../../src/evm/MachineWord'
import { Stack } from '../../src/evm/Stack'
import { StackOverflow, StackUnderflow } from '../../src/evm/errors'

describe('Stack', () => {
  it('can store a single item', () => {
    const stack = new Stack()

    stack.push(MachineWord.ZERO)

    expect(stack.pop().equals(MachineWord.ZERO)).to.equal(true)
  })

  it('can store a multiple items', () => {
    const stack = new Stack()

    stack.push(MachineWord.ZERO)
    stack.push(MachineWord.ONE)

    expect(stack.pop().equals(MachineWord.ONE)).to.equal(true)
    expect(stack.pop().equals(MachineWord.ZERO)).to.equal(true)
  })

  it('adding 1025-th item results in overflow', () => {
    const stack = new Stack()
    for (let i = 0; i < 1024; i++) {
      stack.push(MachineWord.ZERO)
    }
    expect(() => stack.push(MachineWord.ZERO)).to.throw(StackOverflow)
  })

  it('popping on empty stack results in underflow', () => {
    const stack = new Stack()
    expect(() => stack.pop()).to.throw(StackUnderflow)
  })

  it('can duplicate stack items', () => {
    const stack = new Stack()

    stack.push(MachineWord.ZERO)
    stack.dup(1)

    expect(stack.pop().equals(MachineWord.ZERO)).to.equal(true)
    expect(stack.pop().equals(MachineWord.ZERO)).to.equal(true)
  })

  it('can duplicate deeper stack items', () => {
    const stack = new Stack()

    stack.push(MachineWord.ONE)
    stack.push(MachineWord.ZERO)
    stack.dup(2)

    expect(stack.pop().equals(MachineWord.ONE)).to.equal(true)
    expect(stack.pop().equals(MachineWord.ZERO)).to.equal(true)
    expect(stack.pop().equals(MachineWord.ONE)).to.equal(true)
  })

  it('duplicating on empty stack results in underflow', () => {
    const stack = new Stack()
    expect(() => stack.dup(1)).to.throw(StackUnderflow)
  })

  it('duplicating on a shallow stack results in underflow', () => {
    const stack = new Stack()

    stack.push(MachineWord.ZERO)
    stack.push(MachineWord.ZERO)

    expect(() => stack.dup(3)).to.throw(StackUnderflow)
  })

  it('can swap items', () => {
    const stack = new Stack()

    stack.push(MachineWord.ONE)
    stack.push(MachineWord.ZERO)
    stack.swap(1)

    expect(stack.pop().equals(MachineWord.ONE)).to.equal(true)
    expect(stack.pop().equals(MachineWord.ZERO)).to.equal(true)
  })

  it('can swap items deep', () => {
    const stack = new Stack()

    stack.push(MachineWord.ONE)
    stack.push(MachineWord.ZERO)
    stack.push(MachineWord.MAX)
    stack.swap(2)

    expect(stack.pop().equals(MachineWord.ONE)).to.equal(true)
    expect(stack.pop().equals(MachineWord.ZERO)).to.equal(true)
    expect(stack.pop().equals(MachineWord.MAX)).to.equal(true)
  })

  it('swapping on a shallow stack results in underflow', () => {
    const stack = new Stack()

    stack.push(MachineWord.ONE)
    stack.push(MachineWord.ZERO)
    stack.push(MachineWord.MAX)

    expect(() => stack.swap(3)).to.throw(StackUnderflow)
  })
})
