import { makeUnaryOp, makeBinaryOp, makeTernaryOp } from './helpers'
import { GasCost } from './gasCosts'
import { Bytes32 } from '../Bytes32'

// Arithmetic

export const opADD = makeBinaryOp(
  GasCost.VERYLOW,
  (a, b) => a.add(b),
)

export const opMUL = makeBinaryOp(
  GasCost.LOW,
  (a, b) => a.mul(b),
)

export const opSUB = makeBinaryOp(
  GasCost.VERYLOW,
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
  GasCost.MID,
  (a, b, c) => a.add(b).mod(c),
)

export const opMULMOD = makeTernaryOp(
  GasCost.MID,
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
  GasCost.VERYLOW,
  (a, b) => Bytes32.fromBoolean(a.lt(b)),
)

export const opGT = makeBinaryOp(
  GasCost.VERYLOW,
  (a, b) => Bytes32.fromBoolean(a.gt(b)),
)

export const opSLT = makeBinaryOp(
  GasCost.VERYLOW,
  (a, b) => Bytes32.fromBoolean(a.slt(b)),
)

export const opSGT = makeBinaryOp(
  GasCost.VERYLOW,
  (a, b) => Bytes32.fromBoolean(a.sgt(b)),
)

export const opEQ = makeBinaryOp(
  GasCost.VERYLOW,
  (a, b) => Bytes32.fromBoolean(a.eq(b)),
)

export const opISZERO = makeUnaryOp(
  GasCost.VERYLOW,
  (a) => Bytes32.fromBoolean(a.iszero()),
)

// Bitwise Logic

export const opAND = makeBinaryOp(
  GasCost.VERYLOW,
  (a, b) => a.and(b),
)

export const opOR = makeBinaryOp(
  GasCost.VERYLOW,
  (a, b) => a.or(b),
)

export const opXOR = makeBinaryOp(
  GasCost.VERYLOW,
  (a, b) => a.xor(b),
)

export const opNOT = makeUnaryOp(
  GasCost.VERYLOW,
  (a) => a.not(),
)

export const opBYTE = makeBinaryOp(
  GasCost.VERYLOW,
  (a, b) => b.byte(a),
)

// Shifts

export const opSHL = makeBinaryOp(
  GasCost.VERYLOW,
  (a, b) => b.shl(a),
)

export const opSHR = makeBinaryOp(
  GasCost.VERYLOW,
  (a, b) => b.shr(a),
)

export const opSAR = makeBinaryOp(
  GasCost.VERYLOW,
  (a, b) => b.sar(a),
)
