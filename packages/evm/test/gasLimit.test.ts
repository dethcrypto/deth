import { expectError } from './helpers'
import { OutOfGas } from '../src/errors'

describe('gasLimit', () => {
  it('fails with OutOfGas when reached', () => {
    // NOTE: we use SSTORE here to reach OutOfGas quicker
    expectError('JUMPDEST PUSH1 00 DUP1 DUP1 SSTORE JUMP', OutOfGas)
  })
})
