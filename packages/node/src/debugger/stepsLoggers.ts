// eslint-disable-next-line
import { InterpreterStep } from 'ethereumjs-vm/dist/evm/interpreter'
import { bufferToHex } from 'ethereumjs-util'
import { AbiDecoder } from './AbiDecoder'

export const eventLogger = (abiDecoder: AbiDecoder) => (runState: InterpreterStep) => {
  const opcodeName = runState.opcode.name
  if (!opcodeName.startsWith('LOG')) {
    return
  }

  // is there a better way to get topic count?
  const topicsCount = parseInt(opcodeName.substr(3))
  const [memOffset, memLength, ...topics] = getLastN(runState.stack, 2 + topicsCount)

  const topicsBuf = topics.map(function (a) {
    return a.toArrayLike(Buffer, 'be', 32)
  })
  const data = bufferToHex(
    memLength.isZero()
      ? Buffer.alloc(32)
      : getMemoryAsBuffer(runState.memory, memOffset.toNumber(), memLength.toNumber()),
  )

  const decodedLog = abiDecoder.decodeLog({
    data,
    topics: topicsBuf.map(bufferToHex),
  })
  if (decodedLog) {
    // @todo improve output here
    console.log('LOG:', decodedLog.signature, stringifyEthersValue(decodedLog.values))
  } else {
    console.log('LOG: (unrecognized)')
  }
}

function stringifyEthersValue (value: any) {
  const result: string[] = []
  for (let i = 0; i < value.length; i++) {
    result.push(value[i])
  }
  return result.join(', ')
}

export function revertLogger (runState: InterpreterStep) {
  const opcodeName = runState.opcode.name
  if (opcodeName !== 'REVERT') {
    return
  }

  const [offset, length] = getLastN(runState.stack, 2)
  const rawDataBuffer = getMemoryAsBuffer(runState.memory, offset.toNumber(), length.toNumber())
  // dunno why there is a garbage printed out apart from revert string
  console.log(`REVERT with ${rawDataBuffer.toString('utf8')}`)
}

function getLastN<T> (arr: T[], n: number): T[] {
  return arr.slice(-n).reverse()
}

function getMemoryAsBuffer (memory: number[], offset: number, length: number) {
  const rawData = memory.slice(offset, offset + length)
  return Buffer.from(rawData)
}
