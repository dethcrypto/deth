import { Int256 } from '../helpers'

export default [
  {
    stack: [Int256.of(0)],
    expected: Int256.TRUE,
  },
  {
    stack: [Int256.of(-1)],
    expected: Int256.FALSE,
  },
]
