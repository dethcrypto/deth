import { InvalidBytecode } from '../errors'
import { getOpcode, opPush, opUnreachable } from './opcodes'
import { Opcode } from './opcodes/Opcode'

export function parseBytecode (bytecode: string) {
  const result: Opcode[] = []
  const bytes = parseBytes(bytecode)
  for (let i = 0; i < bytes.length; i++) {
    const pushSize = getPushSize(bytes[i])
    if (pushSize !== 0) {
      if (i + pushSize >= bytes.length) {
        throw new InvalidBytecode()
      }
      const toPush = bytes.slice(i + 1, i + pushSize + 1).join('')
      result.push(opPush(toPush))
      for (let j = 0; j < pushSize; j++) {
        result.push(opUnreachable)
      }
      i += pushSize
    } else {
      result.push(getOpcode(bytes[i]))
    }
  }
  return result
}

function getPushSize (byte: string) {
  const num = parseInt(byte, 16)
  if (num >= 0x60 && num <= 0x7f) {
    return num + 1 - 0x60
  }
  return 0
}

function parseBytes (bytecode: string) {
  if (!isHexBytes(bytecode)) {
    throw new InvalidBytecode()
  }
  return bytecode.match(/../g)!.map(x => x)
}

function isHexBytes (value: string) {
  return /^([\da-f]{2})+/.test(value)
}
