import { expectError } from './helpers'
import { OutOfGas } from '../../src/evm/errors'

describe('gasLimit', () => {
  it('fails with OutOfGas when reached', () => {
    expectError('JUMPDEST PUSH1 00 JUMP', OutOfGas)
  })
})
