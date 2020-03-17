import { Bytes } from './Bytes'

export type RlpInput = Bytes | RlpInput[]

export function rlpEncode (value: RlpInput): Bytes {
  if (value instanceof Bytes) {
    return rlpEncodeBytes(value)
  } else {
    return rlpEncodeTuple(value)
  }
}

function rlpEncodeTuple (value: RlpInput[]) {
  const items = rlpEncodeTupleItems(value)
  if (items.length < 56) {
    return Bytes.fromNumber(192 + items.length).concat(items)
  } else { // if items.length < 2^64 - should be always true
    const lengthEncoded = rlpEncodeNumber(items.length)
    return Bytes.fromNumber(247 + lengthEncoded.length)
      .concat(lengthEncoded)
      .concat(items)
  }
}

function rlpEncodeTupleItems (value: RlpInput[]) {
  let result = Bytes.EMPTY
  for (const item of value) {
    result = result.concat(rlpEncode(item))
  }
  return result
}

function rlpEncodeBytes (value: Bytes): Bytes {
  if (value.length === 1 && value.getByteInt(0) < 128) {
    return value
  } else if (value.length < 56) {
    return Bytes.fromNumber(128 + value.length).concat(value)
  } else { // if value.length < 2^64 - should be always true
    const lengthEncoded = rlpEncodeNumber(value.length)
    return Bytes.fromNumber(183 + lengthEncoded.length)
      .concat(lengthEncoded)
      .concat(value)
  }
}

export function rlpEncodeNumber (value: number): Bytes {
  if (value === 0) {
    return Bytes.EMPTY
  }
  return Bytes.fromNumber(value)
}

export function rlpDecode (value: Bytes): RlpInput {
  // TODO: implement
  throw new TypeError('Not implemented!')
}
