import { Int256 } from '../helpers'

export default [
  {
    stack: [
      Int256.of(0x654322),
      Int256.of(0x12365124623),
    ],
    expected: Int256.of(0x76b4b),
  },
  {
    stack: [
      Int256.of(0),
      Int256.of(0x12365124623),
    ],
    expected: Int256.of(0),
  },
]
