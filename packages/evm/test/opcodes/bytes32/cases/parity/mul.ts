import { Int256 } from '../../../../helpers'

export default [
  {
    stack: [
      Int256.of(0x654321),
      Int256.of(0x12365124623),
    ],
    expected: Int256.of('0x734349397b853383'),
  },
]
