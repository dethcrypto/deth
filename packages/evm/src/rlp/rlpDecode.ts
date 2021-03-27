import { Bytes } from '../Bytes'
import { RlpSerializable } from './RlpSerializable'

export function rlpDecode(value: Bytes): RlpSerializable {
  const [result, rest] = rlpDecodePartial(value)
  check(rest.length === 0)
  return result
}

function rlpDecodePartial(value: Bytes): [RlpSerializable, Bytes] {
  check(value.length !== 0)
  const firstByte = value.get(0)

  if (firstByte < 128) {
    check(value.length >= 1)
    return split(value, 0, 1)
  }

  if (firstByte < 128 + 56) {
    const length = firstByte - 128
    check(value.length >= 1 + length)
    check(length !== 1 || value.get(1) >= 128)
    return split(value, 1, 1 + length)
  }

  if (firstByte < 192) {
    return decodeLonger(value, firstByte - 183)
  }

  if (firstByte < 248) {
    const length = firstByte - 192
    check(value.length >= 1 + length)
    const [toDecode, rest] = split(value, 1, 1 + length)
    return [decodeItems(toDecode), rest]
  }

  const [toDecode, rest] = decodeLonger(value, firstByte - 247)
  return [decodeItems(toDecode), rest]
}

function split(value: Bytes, start: number, middle: number): [Bytes, Bytes] {
  return [value.slice(start, middle), value.slice(middle, value.length)]
}

function decodeNumber(value: Bytes) {
  if (value.length === 0) {
    return 0
  }
  check(value.get(0) !== 0)
  return value.toNumber()
}

function decodeLonger(value: Bytes, lengthOfLength: number) {
  check(value.length >= 1 + lengthOfLength)
  const length = decodeNumber(value.slice(1, 1 + lengthOfLength))
  const end = 1 + lengthOfLength + length
  check(length >= 56 && value.length >= end)
  return split(value, 1 + lengthOfLength, end)
}

function decodeItems(value: Bytes) {
  let rest = value
  const result: RlpSerializable[] = []
  while (rest.length > 0) {
    const partial = rlpDecodePartial(rest)
    result.push(partial[0])
    rest = partial[1]
  }
  return result
}

function check(value: boolean): asserts value {
  if (!value) {
    throw new TypeError('Invalid encoding')
  }
}
