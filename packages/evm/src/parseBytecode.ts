import { InvalidBytecode } from './errors'
import { Opcode, getOpcode, makeOpPUSH, opUnreachable } from './opcodes'
import { Bytes } from './Bytes'

export function parseBytecode (bytes: Bytes) {
  const result: Opcode[] = []
  for (let i = 0; i < bytes.length; i++) {
    const byteInt = bytes.getByteInt(i)
    const pushSize = getPushSize(byteInt)
    if (pushSize === 0) {
      result.push(getOpcode(byteInt))
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

function getPushSize (byte: number) {
  if (byte >= 0x60 && byte <= 0x7f) {
    return byte + 1 - 0x60
  }
  return 0
}
