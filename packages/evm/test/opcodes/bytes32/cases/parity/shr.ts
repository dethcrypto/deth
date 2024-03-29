import { Int256 } from '../../../../helpers'

export default [
  {
    stack: [Int256.of(1), Int256.of(0)],
    expected: Int256.of(1),
  },
  {
    stack: [Int256.of(1), Int256.of(1)],
    expected: Int256.of(0),
  },
  {
    stack: [Int256.MIN_SIGNED, Int256.of(1)],
    expected: Int256.of(
      '0x4000000000000000000000000000000000000000000000000000000000000000'
    ),
  },
  {
    stack: [Int256.MIN_SIGNED, Int256.of(0xff)],
    expected: Int256.of(1),
  },
  {
    stack: [Int256.MIN_SIGNED, Int256.of(0x0100)],
    expected: Int256.of(0),
  },
  {
    stack: [Int256.MIN_SIGNED, Int256.of(0x0101)],
    expected: Int256.of(0),
  },
  {
    stack: [Int256.of(-1), Int256.of(0)],
    expected: Int256.of(-1),
  },
  {
    stack: [Int256.of(-1), Int256.of(1)],
    expected: Int256.MAX_SIGNED,
  },
  {
    stack: [Int256.of(-1), Int256.of(0xff)],
    expected: Int256.of(1),
  },
  {
    stack: [Int256.of(-1), Int256.of(0x0100)],
    expected: Int256.of(0),
  },
  {
    stack: [Int256.of(0), Int256.of(1)],
    expected: Int256.of(0),
  },
]
