import { Int256 } from "../helpers";

export default [
  {
    stack: [
      Int256.of(0x0ff0),
      Int256.of(0x00ff),
    ],
    expected: Int256.of(0x00f0),
  },
]
