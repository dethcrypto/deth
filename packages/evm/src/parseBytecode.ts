import { InvalidBytecode } from './errors'
import { Opcode, getOpcode, makeOpPUSH, opUnreachable } from './opcodes'
import { Byte } from './Byte'

export function parseBytecode (bytes: readonly Byte[]) {
  const result: Opcode[] = []
  for (let i = 0; i < bytes.length; i++) {
    const pushSize = getPushSize(bytes[i])
    if (pushSize === 0) {
      result.push(getOpcode(bytes[i]))
    } else {
      if (i + pushSize >= bytes.length) {
        throw new InvalidBytecode()
      }
      const toPush = bytes.slice(i + 1, i + pushSize + 1)
      result.push(makeOpPUSH(toPush))
      for (let j = 0; j < pushSize; j++) {
        result.push(opUnreachable)
      }
      i += pushSize
    }
  }
  return result
}

function getPushSize (byte: Byte) {
  if (byte >= 0x60 && byte <= 0x7f) {
    return byte + 1 - 0x60
  }
  return 0
}
