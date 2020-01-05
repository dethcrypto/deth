import { Int256, TestCase } from '../helpers'

export default [
  {
    title: 'simple addition',
    stack: [
      Int256.of(1),
      Int256.of(2),
    ],
    expected: Int256.of(3),
  },
  {
    title: 'does not care about the order of arguments',
    stack: [
      Int256.of(2),
      Int256.of(1),
    ],
    expected: Int256.of(3),
  },
  {
    title: 'adding negative numbers',
    stack: [
      Int256.of(1),
      Int256.of(-2),
    ],
    expected: Int256.of(-1),
  },
  {
    title: 'loops around',
    stack: [
      Int256.MIN_SIGNED,
      Int256.of(-1),
    ],
    expected: Int256.MAX_SIGNED,
  },
] as TestCase[]
