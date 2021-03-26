import { Bytes } from './Bytes'

export type RlpInput = Bytes | RlpInput[]

export function rlpEncode(value: RlpInput): Bytes {
  if (value instanceof Bytes) {
    return rlpEncodeBytes(value)
  } else {
    return rlpEncodeTuple(value)
  }
}

function rlpEncodeTuple(value: RlpInput[]) {
  const items = rlpEncodeTupleItems(value)
  if (items.length < 56) {
    return Bytes.fromByte(192 + items.length).concat(items)
  } else {
    // if items.length < 2^64 - should be always true
    const lengthEncoded = Bytes.fromNumber(items.length)
    return Bytes.fromByte(247 + lengthEncoded.length)
      .concat(lengthEncoded)
      .concat(items)
  }
}

function rlpEncodeTupleItems(value: RlpInput[]) {
  let result = Bytes.EMPTY
  for (const item of value) {
    result = result.concat(rlpEncode(item))
  }
  return result
}

function rlpEncodeBytes(value: Bytes): Bytes {
  if (value.length === 1 && value.get(0) < 128) {
    return value
  } else if (value.length < 56) {
    return Bytes.fromByte(128 + value.length).concat(value)
  } else {
    // if value.length < 2^64 - should be always true
    const lengthEncoded = Bytes.fromNumber(value.length)
    return Bytes.fromByte(183 + lengthEncoded.length)
      .concat(lengthEncoded)
      .concat(value)
  }
}

export function rlpDecode(value: Bytes): RlpInput {
  // TODO: implement
  throw new TypeError('Not implemented!')
}
