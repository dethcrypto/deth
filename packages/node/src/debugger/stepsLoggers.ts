// eslint-disable-next-line
import { InterpreterStep } from 'ethereumjs-vm/dist/evm/interpreter'
import { bufferToHex } from 'ethereumjs-util'

// eslint-disable-next-line
const abiDecoder = require('abi-decoder')
// eslint-disable-next-line
abiDecoder.addABI(require('./known-abi.json'))

export function eventLogger (runState: InterpreterStep) {
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

  const logs = [
    {
      data,
      topics: topicsBuf.map(bufferToHex),
    },
  ]

  const decodedLog = abiDecoder.decodeLogs(logs)[0]
  if (decodedLog) {
    console.log('LOG: ', decodedLog.name, decodedLog.events)
  } else {
    console.log('LOG: (unrecognized)')
  }
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
