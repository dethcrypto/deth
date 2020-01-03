import { Int256 } from '../helpers'

export default [
  {
    stack: [
      Int256.of(0x16),
      Int256.of(0x12365124623),
    ],
    expected: Int256.FALSE,
  },
]
