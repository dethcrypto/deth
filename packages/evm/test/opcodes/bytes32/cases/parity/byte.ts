import { Int256 } from '../../../../helpers'

export default [
  {
    stack: [Int256.of(0xf0), Int256.of(0xffff)],
    expected: Int256.of(0),
  },
  {
    stack: [Int256.of(0xfff), Int256.of(0x1f)],
    expected: Int256.of(0xff),
  },
]
