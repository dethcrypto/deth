import * as t from 'io-ts'
import { Either, map } from 'fp-ts/lib/Either'
import { flow } from 'lodash'
import { makeQuantity, makeHexData, makeHash, makeAddress } from '@ethereum-ts/chain'

const mapCodec = <A, O, I, P, X>(
  type: t.Type<A, O, I>,
  mapInput: (a: Either<t.Errors, A>) => Either<t.Errors, X>,
  mapOutput: (p: O) => P,
): t.Type<X, P, I> =>
  new t.Type(
    type.name,
    type.is,
    (i: I, c) => mapInput(type.validate(i, c)) as any,
    a => mapOutput(type.encode(a)),
  ) as any // @TODO: without any I can't get compiler to accept this type...

export const quantity = codecFromMake(makeQuantity)
export const hexData = codecFromMake(flow(normalize0xPrefix, makeHexData))
export const hash = codecFromMake(makeHash)
export const address = codecFromMake(makeAddress)

function normalize0xPrefix (data: string): string {
  if (!data.startsWith('0x')) {
    return '0x' + data
  }
  return data
}

const toNull = <A>(x: A | undefined): A | null => x ?? null
const toUndefined = <A>(x: A | null | undefined): A | undefined => x ?? undefined
const toDefaultValue = <A>(defaultValue: A) => (x: A | null | undefined): A | undefined => x ?? defaultValue

// automatically deals with null/undefined conversions across the RPC <-> our code boundary
// decodes: null and undefined to undefined
// encodes undefined to nulls
export const undefinable = <A, O>(type: t.Type<A, O>) =>
  mapCodec(t.union([type, t.null, t.undefined]), map(toUndefined), toNull)
export const undefinableOr = <A, O>(type: t.Type<A, O>, defaultInputValue: A) =>
  mapCodec(t.union([type, t.null, t.undefined]), map(toDefaultValue(defaultInputValue)), toNull)

function codecFromMake<T extends string> (make: (value: string) => T) {
  return new t.Type<T, string, unknown>('RPC_QUANTITY', checkFromMake(make), validateFromMake(make), make)
}

function checkFromMake<T> (make: (value: string) => T) {
  return (value: unknown): value is T => {
    if (typeof value !== 'string') {
      return false
    }
    try {
      return make(value) === (value as unknown)
    } catch {
      return false
    }
  }
}

function validateFromMake<T> (make: (value: string) => T) {
  return (value: unknown, c: t.Context): Either<t.Errors, T> => {
    if (typeof value !== 'string') {
      return t.failure('Value is not a string', c)
    }
    try {
      return t.success(make(value))
    } catch (e) {
      return t.failure(`Can't parse value. Reason: ${e.message ?? 'unknown'}. Original value: "${value}"`, c)
    }
  }
}
