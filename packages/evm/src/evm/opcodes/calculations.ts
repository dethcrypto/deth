import { makeUnaryOp, makeBinaryOp, makeTernaryOp } from './helpers'
import { MachineWord } from '../../MachineWord'
import { GasCost } from './gasCosts'

// Arithmetic

export const opADD = makeBinaryOp(
  GasCost.VERY_LOW,
  (a, b) => a.add(b)
)

export const opMUL = makeBinaryOp(
  GasCost.LOW,
  (a, b) => a.multiply(b)
)

export const opSUB = makeBinaryOp(
  GasCost.VERY_LOW,
  (a, b) => a.subtract(b)
)

export const opDIV = makeBinaryOp(
  GasCost.LOW,
  (a, b) => a.unsignedDivide(b)
)

export const opSDIV = makeBinaryOp(
  GasCost.LOW,
  (a, b) => a.signedDivide(b)
)

export const opMOD = makeBinaryOp(
  GasCost.LOW,
  (a, b) => a.unsignedModulo(b),
)

export const opSMOD = makeBinaryOp(
  GasCost.LOW,
  (a, b) => a.signedModulo(b)
)

export const opADDMOD = makeTernaryOp(
  GasCost.MEDIUM,
  (a, b, c) => a.add(b).unsignedModulo(c)
)

export const opMULMOD = makeTernaryOp(
  GasCost.MEDIUM,
  (a, b, c) => a.multiply(b).unsignedModulo(c)
)

export const opEXP = makeBinaryOp(
  GasCost.ZERO, // TODO: proper exp gas cost calculation
  (a, b) => a.exponentiate(b)
)

export const opSIGNEXTEND = makeBinaryOp(
  GasCost.LOW,
  (a, b) => b.extendSign(a)
)

// Comparison & Bitwise Logic

export const opLT = makeBinaryOp(
  GasCost.VERY_LOW,
  (a, b) => MachineWord.fromBoolean(a.unsignedLessThan(b))
)

export const opGT = makeBinaryOp(
  GasCost.VERY_LOW,
  (a, b) => MachineWord.fromBoolean(a.unsignedGreaterThan(b))
)

export const opSLT = makeBinaryOp(
  GasCost.VERY_LOW,
  (a, b) => MachineWord.fromBoolean(a.signedLessThan(b))
)

export const opSGT = makeBinaryOp(
  GasCost.VERY_LOW,
  (a, b) => MachineWord.fromBoolean(a.signedGreaterThan(b))
)

export const opEQ = makeBinaryOp(
  GasCost.VERY_LOW,
  (a, b) => MachineWord.fromBoolean(a.equals(b))
)

export const opISZERO = makeUnaryOp(
  GasCost.VERY_LOW,
  (a) => MachineWord.fromBoolean(a.isZero())
)

export const opAND = makeBinaryOp(
  GasCost.VERY_LOW,
  (a, b) => a.and(b)
)

export const opOR = makeBinaryOp(
  GasCost.VERY_LOW,
  (a, b) => a.or(b)
)

export const opXOR = makeBinaryOp(
  GasCost.VERY_LOW,
  (a, b) => a.xor(b)
)

export const opNOT = makeUnaryOp(
  GasCost.VERY_LOW,
  (a) => a.not()
)

export const opBYTE = makeBinaryOp(
  GasCost.VERY_LOW,
  (a, b) => b.getByte(a)
)

// shifts

export const opSHL = makeBinaryOp(
  GasCost.VERY_LOW,
  (a, b) => b.shiftLeft(a)
)

export const opSHR = makeBinaryOp(
  GasCost.VERY_LOW,
  (a, b) => b.logicalShiftRight(a)
)

export const opSAR = makeBinaryOp(
  GasCost.VERY_LOW,
  (a, b) => b.arithmeticShiftRight(a)
)
