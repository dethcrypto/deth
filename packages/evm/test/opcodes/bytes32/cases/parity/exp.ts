import { Int256 } from '../../../../helpers'

export default [
  {
    stack: [
      Int256.of(0x16),
      Int256.of(0x12365124623),
    ],
    expected: Int256.of('0x90fd23767b60204c3d6fc8aec9e70a42a3f127140879c133a20129a597ed0c59'),
  },
  {
    stack: [
      Int256.of(1),
      Int256.of(0x12365124623),
    ],
    expected: Int256.of(0x12365124623),
  },
  {
    stack: [
      Int256.of(0),
      Int256.of(0x12365124623),
    ],
    expected: Int256.of(1),
  },
]
