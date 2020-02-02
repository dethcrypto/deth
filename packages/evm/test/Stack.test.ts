import { expect } from 'chai'
import { Bytes32 } from '../src/Bytes32'
import { Stack } from '../src/Stack'
import { StackOverflow, StackUnderflow } from '../src/errors'

const A = Bytes32.ONE
const B = A.add(A)
const C = B.add(A)

describe('Stack', () => {
  it('can store a single item', () => {
    const stack = new Stack()

    stack.push(A)

    expect(stack.pop()).to.equal(A)
  })

  it('can store a multiple items', () => {
    const stack = new Stack()

    stack.push(A)
    stack.push(B)

    expect(stack.pop()).to.equal(B)
    expect(stack.pop()).to.equal(A)
  })

  it('adding 1025-th item results in overflow', () => {
    const stack = new Stack()
    for (let i = 0; i < 1024; i++) {
      stack.push(A)
    }
    expect(() => stack.push(A)).to.throw(StackOverflow)
  })

  it('popping on empty stack results in underflow', () => {
    const stack = new Stack()
    expect(() => stack.pop()).to.throw(StackUnderflow)
  })

  it('can duplicate stack items', () => {
    const stack = new Stack()

    stack.push(A)
    stack.dup(1)

    expect(stack.pop()).to.equal(A)
    expect(stack.pop()).to.equal(A)
  })

  it('can duplicate deeper stack items', () => {
    const stack = new Stack()

    stack.push(B)
    stack.push(A)
    stack.dup(2)

    expect(stack.pop()).to.equal(B)
    expect(stack.pop()).to.equal(A)
    expect(stack.pop()).to.equal(B)
  })

  it('duplicating on empty stack results in underflow', () => {
    const stack = new Stack()
    expect(() => stack.dup(1)).to.throw(StackUnderflow)
  })

  it('duplicating on a shallow stack results in underflow', () => {
    const stack = new Stack()

    stack.push(A)
    stack.push(A)

    expect(() => stack.dup(3)).to.throw(StackUnderflow)
  })

  it('can swap items', () => {
    const stack = new Stack()

    stack.push(B)
    stack.push(A)
    stack.swap(1)

    expect(stack.pop()).to.equal(B)
    expect(stack.pop()).to.equal(A)
  })

  it('can swap items deep', () => {
    const stack = new Stack()

    stack.push(B)
    stack.push(A)
    stack.push(C)
    stack.swap(2)

    expect(stack.pop()).to.equal(B)
    expect(stack.pop()).to.equal(A)
    expect(stack.pop()).to.equal(C)
  })

  it('swapping on a shallow stack results in underflow', () => {
    const stack = new Stack()

    stack.push(B)
    stack.push(A)
    stack.push(C)

    expect(() => stack.swap(3)).to.throw(StackUnderflow)
  })
})
