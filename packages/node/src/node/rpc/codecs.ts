import * as t from 'io-ts'
import { Either } from 'fp-ts/lib/Either'
import { makeQuantity, makeHexData, makeHash, makeAddress } from '../../primitives'

export const quantity = codecFromMake(makeQuantity)
export const hexData = codecFromMake(makeHexData)
export const hash = codecFromMake(makeHash)
export const address = codecFromMake(makeAddress)

function codecFromMake <T extends string> (make: (value: string) => T) {
  return new t.Type<T, string, unknown>(
    'RPC_QUANTITY',
    checkFromMake(make),
    validateFromMake(make),
    make,
  )
}

function checkFromMake <T> (make: (value: string) => T) {
  return (value: unknown): value is T => {
    if (typeof value !== 'string') {
      return false
    }
    try {
      return make(value) === value as unknown
    } catch {
      return false
    }
  }
}

function validateFromMake <T> (make: (value: string) => T) {
  return (value: unknown, c: t.Context): Either<t.Errors, T> => {
    if (typeof value !== 'string') {
      return t.failure('Value is not a string', c)
    }
    try {
      return t.success(make(value))
    } catch (e) {
      return t.failure(`Can't parse "${value}"`, c)
    }
  }
}
