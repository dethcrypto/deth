import { Int256 } from "../helpers";

export default [
  {
    stack: [
      Int256.of(1),
      Int256.of(0),
    ],
    expected: Int256.of(1),
  },
  {
    stack: [
      Int256.of(1),
      Int256.of(1),
    ],
    expected: Int256.of(2),
  },
  {
    stack: [
      Int256.of(1),
      Int256.of(0xff),
    ],
    expected: Int256.MIN_SIGNED,
  },
  {
    stack: [
      Int256.of(1),
      Int256.of(0x100),
    ],
    expected: Int256.of(0),
  },
  {
    stack: [
      Int256.of(1),
      Int256.of(0x101),
    ],
    expected: Int256.of(0),
  },
  {
    stack: [
      Int256.of(-1),
      Int256.of(0),
    ],
    expected: Int256.of(-1),
  },
  {
    stack: [
      Int256.of(-1),
      Int256.of(1),
    ],
    expected: Int256.of(-2),
  },
  {
    stack: [
      Int256.of(-1),
      Int256.of(0xff),
    ],
    expected: Int256.MIN_SIGNED,
  },
  {
    stack: [
      Int256.of(-1),
      Int256.of(0x100),
    ],
    expected: Int256.of(0),
  },
  {
    stack: [
      Int256.of(0),
      Int256.of(1),
    ],
    expected: Int256.of(0),
  },
  {
    stack: [
      Int256.MAX_SIGNED,
      Int256.of(1),
    ],
    expected: Int256.of(-2),
  },
]
