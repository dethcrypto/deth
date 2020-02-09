import { Opcode } from './Opcode'
import {
  opSTOP,
  opJUMP,
  opJUMPI,
  opJUMPDEST,
  opRETURN,
  opREVERT,
} from './control'
import {
  opADD,
  opMUL,
  opSUB,
  opDIV,
  opSDIV,
  opMOD,
  opSMOD,
  opADDMOD,
  opMULMOD,
  opEXP,
  opSIGNEXTEND,
  opLT,
  opGT,
  opSLT,
  opSGT,
  opEQ,
  opISZERO,
  opAND,
  opOR,
  opXOR,
  opNOT,
  opBYTE,
  opSHL,
  opSHR,
  opSAR,
} from './bytes32'
import { invalidOpcode } from './invalid'
import { makeOpDUP, makeOpSWAP, opPOP } from './stack'
import { opMSIZE, opMLOAD, opMSTORE, opMSTORE8 } from './memory'
import { opSSTORE, opSLOAD } from './storage'
import { Byte } from '../Byte'
import { opCODESIZE, opCODECOPY } from './code'
import { opCREATE } from './create'

export { opUnreachable } from './invalid'
export { makeOpPUSH } from './stack'
export { Opcode } from './Opcode'
export { GasCost, GasRefund } from './gasCosts'

export function getOpcode (hex: Byte) {
  return OP_CODES[hex] ?? invalidOpcode(hex)
}

const OP_CODES: Record<number, Opcode | undefined> = {
  0x00: opSTOP,
  0x01: opADD,
  0x02: opMUL,
  0x03: opSUB,
  0x04: opDIV,
  0x05: opSDIV,
  0x06: opMOD,
  0x07: opSMOD,
  0x08: opADDMOD,
  0x09: opMULMOD,
  0x0a: opEXP,
  0x0b: opSIGNEXTEND,
  0x10: opLT,
  0x11: opGT,
  0x12: opSLT,
  0x13: opSGT,
  0x14: opEQ,
  0x15: opISZERO,
  0x16: opAND,
  0x17: opOR,
  0x18: opXOR,
  0x19: opNOT,
  0x1a: opBYTE,
  0x1b: opSHL,
  0x1c: opSHR,
  0x1d: opSAR,
  0x38: opCODESIZE,
  0x39: opCODECOPY,
  0x50: opPOP,
  0x51: opMLOAD,
  0x52: opMSTORE,
  0x53: opMSTORE8,
  0x54: opSLOAD,
  0x55: opSSTORE,
  0x56: opJUMP,
  0x57: opJUMPI,
  0x59: opMSIZE,
  0x5b: opJUMPDEST,
  // 60 - 7f PUSH - handled differently
  0x80: makeOpDUP(1),
  0x81: makeOpDUP(2),
  0x82: makeOpDUP(3),
  0x83: makeOpDUP(4),
  0x84: makeOpDUP(5),
  0x85: makeOpDUP(6),
  0x86: makeOpDUP(7),
  0x87: makeOpDUP(8),
  0x88: makeOpDUP(9),
  0x89: makeOpDUP(10),
  0x8a: makeOpDUP(11),
  0x8b: makeOpDUP(12),
  0x8c: makeOpDUP(13),
  0x8d: makeOpDUP(14),
  0x8e: makeOpDUP(15),
  0x8f: makeOpDUP(16),
  0x90: makeOpSWAP(1),
  0x91: makeOpSWAP(2),
  0x92: makeOpSWAP(3),
  0x93: makeOpSWAP(4),
  0x94: makeOpSWAP(5),
  0x95: makeOpSWAP(6),
  0x96: makeOpSWAP(7),
  0x97: makeOpSWAP(8),
  0x98: makeOpSWAP(9),
  0x99: makeOpSWAP(10),
  0x9a: makeOpSWAP(11),
  0x9b: makeOpSWAP(12),
  0x9c: makeOpSWAP(13),
  0x9d: makeOpSWAP(14),
  0x9e: makeOpSWAP(15),
  0x9f: makeOpSWAP(16),
  0xf0: opCREATE,
  0xf3: opRETURN,
  0xfd: opREVERT,
}
