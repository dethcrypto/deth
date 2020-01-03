import { Int256 } from "../helpers";

export default [
  {
    stack: [
      Int256.of(0xfff),
      Int256.of(2),
    ],
    expected: Int256.of(0xfff),
  },
  {
    stack: [
      Int256.of(0xff),
      Int256.of(0x20),
    ],
    expected: Int256.of(0xff),
  },
]
