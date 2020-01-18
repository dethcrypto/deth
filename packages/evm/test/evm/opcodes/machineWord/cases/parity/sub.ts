import { Int256 } from '../../../../helpers'

export default [
  {
    stack: [
      Int256.of(0x654321),
      Int256.of(0x12365124623),
    ],
    expected: Int256.of(0x12364ad0302),
  },
]
