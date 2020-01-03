import { Int256 } from "../helpers";

export default [
  {
    stack: [
      Int256.of(0x12365124623),
      Int256.of(0x16),
    ],
    expected: Int256.FALSE,
  },
  {
    stack: [
      Int256.of(0x1523541235),
      Int256.of(0x1523541235),
    ],
    expected: Int256.TRUE,
  },
]
