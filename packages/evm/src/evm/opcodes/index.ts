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
} from './machineWord'
import { invalidOpcode } from './invalid'
import { makeOpDUP, makeOpSWAP, opPOP } from './stack'
import { opMSIZE, opMLOAD, opMSTORE, opMSTORE8 } from './memory'

export { opUnreachable } from './invalid'
export { makeOpPUSH } from './stack'
export { Opcode } from './Opcode'
export { GasCost } from './gasCosts'

export function getOpcode (hex: string) {
  return OP_CODES[hex] ?? invalidOpcode(hex)
}

/* eslint-disable quote-props */
const OP_CODES: Record<string, Opcode | undefined> = {
  '00': opSTOP,
  '01': opADD,
  '02': opMUL,
  '03': opSUB,
  '04': opDIV,
  '05': opSDIV,
  '06': opMOD,
  '07': opSMOD,
  '08': opADDMOD,
  '09': opMULMOD,
  '0a': opEXP,
  '0b': opSIGNEXTEND,
  '10': opLT,
  '11': opGT,
  '12': opSLT,
  '13': opSGT,
  '14': opEQ,
  '15': opISZERO,
  '16': opAND,
  '17': opOR,
  '18': opXOR,
  '19': opNOT,
  '1a': opBYTE,
  '1b': opSHL,
  '1c': opSHR,
  '1d': opSAR,
  '50': opPOP,
  '51': opMLOAD,
  '52': opMSTORE,
  '53': opMSTORE8,
  '56': opJUMP,
  '57': opJUMPI,
  '59': opMSIZE,
  '5b': opJUMPDEST,
  // 60 - 7f PUSH - handled differently
  '80': makeOpDUP(1),
  '81': makeOpDUP(2),
  '82': makeOpDUP(3),
  '83': makeOpDUP(4),
  '84': makeOpDUP(5),
  '85': makeOpDUP(6),
  '86': makeOpDUP(7),
  '87': makeOpDUP(8),
  '88': makeOpDUP(9),
  '89': makeOpDUP(10),
  '8a': makeOpDUP(11),
  '8b': makeOpDUP(12),
  '8c': makeOpDUP(13),
  '8d': makeOpDUP(14),
  '8e': makeOpDUP(15),
  '8f': makeOpDUP(16),
  '90': makeOpSWAP(1),
  '91': makeOpSWAP(2),
  '92': makeOpSWAP(3),
  '93': makeOpSWAP(4),
  '94': makeOpSWAP(5),
  '95': makeOpSWAP(6),
  '96': makeOpSWAP(7),
  '97': makeOpSWAP(8),
  '98': makeOpSWAP(9),
  '99': makeOpSWAP(10),
  '9a': makeOpSWAP(11),
  '9b': makeOpSWAP(12),
  '9c': makeOpSWAP(13),
  '9d': makeOpSWAP(14),
  '9e': makeOpSWAP(15),
  '9f': makeOpSWAP(16),
  'f3': opRETURN,
  'fd': opREVERT,
}
