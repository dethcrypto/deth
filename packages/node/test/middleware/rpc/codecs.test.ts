import { hexData } from '../../../src/rpc/codecs'
import { expect } from 'chai'
import { isRight, Either, Right } from 'fp-ts/lib/Either'

function takeRightOrThrow<L, R> (value: Either<L, R>): R {
  expect(isRight(value), 'expected value to be right but got left').to.be.true

  return ((value as any) as Right<R>).right
}

describe('codecs > hexData', () => {
  it('works with 0x prefixed values', () => {
    const input = '0x1234'

    expect(takeRightOrThrow(hexData.decode(input))).to.be.eq('0x1234')
  })

  it('works without 0x prefix values', () => {
    const input = '1234'

    expect(takeRightOrThrow(hexData.decode(input))).to.be.eq('0x1234')
  })
})
