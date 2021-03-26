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
    return [value.slice(0, 1), value.slice(1, value.length)]
  }

  if (firstByte < 128 + 56) {
    const length = firstByte - 128
    check(value.length >= 1 + length)
    return [value.slice(1, 1 + length), value.slice(1 + length, value.length)]
  }

  if (firstByte < 192) {
    const lengthOfLength = firstByte - 183
    check(value.length >= 1 + lengthOfLength)
    const length = value.slice(1, 1 + lengthOfLength).toNumber()
    const end = 1 + lengthOfLength + length
    check(length >= 56 && value.length >= end)
    return [
      value.slice(1 + lengthOfLength, end),
      value.slice(end, value.length),
    ]
  }

  if (firstByte < 248) {
    const length = firstByte - 192
    let rest = value.slice(1, 1 + length)
    const result: RlpSerializable[] = []
    while (rest.length > 0) {
      const partial = rlpDecodePartial(rest)
      result.push(partial[0])
      rest = partial[1]
    }
    return [result, value.slice(1 + length, value.length)]
  }

  const lengthOfLength = firstByte - 247
  check(value.length >= 1 + lengthOfLength)
  const length = value.slice(1, 1 + lengthOfLength).toNumber()
  const end = 1 + lengthOfLength + length
  let rest = value.slice(1 + lengthOfLength, end)
  const result: RlpSerializable[] = []
  while (rest.length > 0) {
    const partial = rlpDecodePartial(rest)
    result.push(partial[0])
    rest = partial[1]
  }
  return [result, value.slice(end, value.length)]
}

function check(value: boolean): asserts value {
  if (!value) {
    throw new TypeError('Invalid encoding')
  }
}
