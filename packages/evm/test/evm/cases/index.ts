import { importGeth, importParity } from './helpers'

import gethADD from './geth/add.json'
import parityADD from './parity/add'
import dethADD from './deth/add'

import gethMUL from './geth/mul.json'
import parityMUL from './parity/mul'

import gethSUB from './geth/sub.json'
import paritySUB from './parity/sub'

import gethDIV from './geth/div.json'
import parityDIV from './parity/div'

import gethSDIV from './geth/sdiv.json'
import paritySDIV from './parity/sdiv'

import gethMOD from './geth/mod.json'
import parityMOD from './parity/mod'

import gethSMOD from './geth/smod.json'
import paritySMOD from './parity/smod'

import parityADDMOD from './parity/addmod'

import parityMULMOD from './parity/mulmod'

import gethEXP from './geth/exp.json'
import parityEXP from './parity/exp'

import gethSIGNEXTEND from './geth/signextend.json'
import paritySIGNEXTEND from './parity/signextend'

import gethLT from './geth/lt.json'
import parityLT from './parity/lt'

import gethGT from './geth/gt.json'
import parityGT from './parity/gt'

import gethSLT from './geth/slt.json'
import paritySLT from './parity/slt'

import gethSGT from './geth/sgt.json'
import paritySGT from './parity/sgt'

import gethEQ from './geth/eq.json'
import parityEQ from './parity/eq'

import parityISZERO from './parity/iszero'

import gethAND from './geth/and.json'
import parityAND from './parity/and'

import gethOR from './geth/or.json'
import parityOR from './parity/or'

import gethXOR from './geth/xor.json'
import parityXOR from './parity/xor'

import parityNOT from './parity/not'

import gethBYTE from './geth/byte.json'
import parityBYTE from './parity/byte'

import gethSHL from './geth/shl.json'
import paritySHL from './parity/shl'

import gethSHR from './geth/shr.json'
import paritySHR from './parity/shr'

import gethSAR from './geth/sar.json'
import paritySAR from './parity/sar'

export { TestCase } from './helpers'

export const TestCases = {
  ADD: [
    ...importGeth(gethADD),
    ...importParity(parityADD),
    ...dethADD,
  ],
  MUL: [
    ...importGeth(gethMUL),
    ...importParity(parityMUL),
  ],
  SUB: [
    ...importGeth(gethSUB),
    ...importParity(paritySUB),
  ],
  DIV: [
    ...importGeth(gethDIV),
    ...importParity(parityDIV),
  ],
  SDIV: [
    ...importGeth(gethSDIV),
    ...importParity(paritySDIV),
  ],
  MOD: [
    ...importGeth(gethMOD),
    ...importParity(parityMOD),
  ],
  SMOD: [
    ...importGeth(gethSMOD),
    ...importParity(paritySMOD),
  ],
  ADDMOD: [
    ...importParity(parityADDMOD)
  ],
  MULMOD: [
    ...importParity(parityMULMOD)
  ],
  EXP: [
    ...importGeth(gethEXP),
    ...importParity(parityEXP),
  ],
  SIGNEXTEND: [
    ...importGeth(gethSIGNEXTEND),
    ...importParity(paritySIGNEXTEND),
  ],
  LT: [
    ...importGeth(gethLT),
    ...importParity(parityLT),
  ],
  GT: [
    ...importGeth(gethGT),
    ...importParity(parityGT),
  ],
  SLT: [
    ...importGeth(gethSLT),
    ...importParity(paritySLT),
  ],
  SGT: [
    ...importGeth(gethSGT),
    ...importParity(paritySGT),
  ],
  EQ: [
    ...importGeth(gethEQ),
    ...importParity(parityEQ),
  ],
  ISZERO: [
    ...importParity(parityISZERO),
  ],
  AND: [
    ...importGeth(gethAND),
    ...importParity(parityAND),
  ],
  OR: [
    ...importGeth(gethOR),
    ...importParity(parityOR),
  ],
  XOR: [
    ...importGeth(gethXOR),
    ...importParity(parityXOR),
  ],
  NOT: [
    ...importParity(parityNOT),
  ],
  BYTE: [
    ...importGeth(gethBYTE),
    ...importParity(parityBYTE),
  ],
  SHL: [
    ...importGeth(gethSHL),
    ...importParity(paritySHL),
  ],
  SHR: [
    ...importGeth(gethSHR),
    ...importParity(paritySHR),
  ],
  SAR: [
    ...importGeth(gethSAR),
    ...importParity(paritySAR),
  ],
}
