import { Int256 } from '../../../../helpers'

export default [
  {
    stack: [Int256.of(0xff), Int256.of(0xf0), Int256.of(0x10)],
    expected: Int256.of(0xf),
  },
  {
    stack: [Int256.of(0x00), Int256.of(0xf0), Int256.of(0x10)],
    expected: Int256.of(0),
  },
]
