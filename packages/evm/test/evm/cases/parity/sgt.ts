import { Int256 } from "../helpers";

export default [
  {
    stack: [
      Int256.of(-0x10),
      Int256.of(0x10),
    ],
    expected: Int256.TRUE,
  },
  {
    stack: [
      Int256.of(0x10),
      Int256.of(-0x10),
    ],
    expected: Int256.FALSE,
  },
]
