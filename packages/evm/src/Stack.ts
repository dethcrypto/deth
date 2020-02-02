import { Bytes32 } from './Bytes32'
import { StackUnderflow, StackOverflow } from './errors'

const MAX_STACK_SIZE = 1024

export class Stack {
  private items: Bytes32[] = []

  push (word: Bytes32) {
    if (this.items.length === MAX_STACK_SIZE) {
      throw new StackOverflow()
    }
    this.items.push(word)
  }

  pop () {
    const value = this.items.pop()
    if (!value) {
      throw new StackUnderflow()
    }
    return value
  }

  dup (position: number) {
    if (this.items.length < position) {
      throw new StackUnderflow()
    }

    const target = this.items.length - position
    this.push(this.items[target])
  }

  swap (position: number) {
    if (this.items.length <= position) {
      throw new StackUnderflow()
    }

    const top = this.items.length - 1
    const target = top - position

    const tmp = this.items[top]
    this.items[top] = this.items[target]
    this.items[target] = tmp
  }
}
