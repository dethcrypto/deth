import { makeUnaryOp, makeBinaryOp, makeTernaryOp } from './helpers'
import { GasCost } from './gasCosts'

// Arithmetic

export const opADD = makeBinaryOp(
  GasCost.VERY_LOW,
  (a, b) => a.add(b),
)

export const opMUL = makeBinaryOp(
  GasCost.LOW,
  (a, b) => a.mul(b),
)

export const opSUB = makeBinaryOp(
  GasCost.VERY_LOW,
  (a, b) => a.sub(b),
)

export const opDIV = makeBinaryOp(
  GasCost.LOW,
  (a, b) => a.div(b),
)

export const opSDIV = makeBinaryOp(
  GasCost.LOW,
  (a, b) => a.sdiv(b),
)

export const opMOD = makeBinaryOp(
  GasCost.LOW,
  (a, b) => a.mod(b),
)

export const opSMOD = makeBinaryOp(
  GasCost.LOW,
  (a, b) => a.smod(b),
)

export const opADDMOD = makeTernaryOp(
  GasCost.MEDIUM,
  (a, b, c) => a.add(b).mod(c),
)

export const opMULMOD = makeTernaryOp(
  GasCost.MEDIUM,
  (a, b, c) => a.mul(b).mod(c),
)

export const opEXP = makeBinaryOp(
  GasCost.ZERO, // TODO: proper exp gas cost calculation
  (a, b) => a.exp(b),
)

export const opSIGNEXTEND = makeBinaryOp(
  GasCost.LOW,
  (a, b) => b.signextend(a),
)

// Comparison

export const opLT = makeBinaryOp(
  GasCost.VERY_LOW,
  (a, b) => a.lt(b),
)

export const opGT = makeBinaryOp(
  GasCost.VERY_LOW,
  (a, b) => a.gt(b),
)

export const opSLT = makeBinaryOp(
  GasCost.VERY_LOW,
  (a, b) => a.slt(b),
)

export const opSGT = makeBinaryOp(
  GasCost.VERY_LOW,
  (a, b) => a.sgt(b),
)

export const opEQ = makeBinaryOp(
  GasCost.VERY_LOW,
  (a, b) => a.eq(b),
)

export const opISZERO = makeUnaryOp(
  GasCost.VERY_LOW,
  (a) => a.iszero(),
)

// Bitwise Logic

export const opAND = makeBinaryOp(
  GasCost.VERY_LOW,
  (a, b) => a.and(b),
)

export const opOR = makeBinaryOp(
  GasCost.VERY_LOW,
  (a, b) => a.or(b),
)

export const opXOR = makeBinaryOp(
  GasCost.VERY_LOW,
  (a, b) => a.xor(b),
)

export const opNOT = makeUnaryOp(
  GasCost.VERY_LOW,
  (a) => a.not(),
)

export const opBYTE = makeBinaryOp(
  GasCost.VERY_LOW,
  (a, b) => b.byte(a),
)

// Shifts

export const opSHL = makeBinaryOp(
  GasCost.VERY_LOW,
  (a, b) => b.shl(a),
)

export const opSHR = makeBinaryOp(
  GasCost.VERY_LOW,
  (a, b) => b.shr(a),
)

export const opSAR = makeBinaryOp(
  GasCost.VERY_LOW,
  (a, b) => b.sar(a),
)
