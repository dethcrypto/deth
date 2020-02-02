import { Byte } from './Byte'

export class Tuple {
  constructor (public items: (Tuple | Byte[])[]) {}
}

export function rlpEncode (value: Tuple | Byte[]): Byte[] {
  if (Array.isArray(value)) {
    return rlpEncodeBytes(value)
  } else {
    return rlpEncodeTuple(value)
  }
}

function rlpEncodeTuple (value: Tuple) {
  const items = rlpEncodeTupleItems(value)
  if (items.length < 56) {
    return [
      (192 + items.length) as Byte,
      ...items,
    ]
  } else { // if items.length < 2^64 - should be always true
    const lengthEncoded = rlpEncodeNumber(items.length)
    return [
      (247 + lengthEncoded.length) as Byte,
      ...lengthEncoded,
      ...items,
    ]
  }
}

function rlpEncodeTupleItems (value: Tuple) {
  const result: Byte[] = []
  for (const item of value.items) {
    result.push(...rlpEncode(item))
  }
  return result
}

function rlpEncodeBytes (value: Byte[]): Byte[] {
  if (value.length === 1 && value[0] < 128) {
    return value
  } else if (value.length < 56) {
    return [
      (128 + value.length) as Byte,
      ...value,
    ]
  } else { // if value.length < 2^64 - should be always true
    const lengthEncoded = rlpEncodeNumber(value.length)
    return [
      (183 + lengthEncoded.length) as Byte,
      ...lengthEncoded,
      ...value,
    ]
  }
}

export function rlpEncodeNumber (value: number): Byte[] {
  if (value === 0) {
    return []
  }
  let str = value.toString(16)
  if (str.length % 2 !== 0) {
    str = '0' + str
  }
  return str.match(/../g)!.map(x => parseInt(x, 16) as Byte)
}

export function rlpDecode (value: Byte[]): Tuple | Byte[] {
  // TODO: implement
  throw new TypeError('Not implemented!')
}
