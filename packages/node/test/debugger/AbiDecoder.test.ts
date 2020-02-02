import { mockFs } from '../fs/fs.mock'
import { AbiDecoder } from '../../src/debugger/AbiDecoder'
import { makePath } from '../../src/fs/Path'
import { expect } from 'chai'
import { spy } from 'sinon'

const abi = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'src', type: 'address' },
      { indexed: true, internalType: 'address', name: 'dst', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'wad', type: 'uint256' },
    ],
    name: 'Transfer',
    type: 'event',
  },
]

const log = {
  data: '0x00000000000000000000000000000000000000000000000000190fbc083c19c8',
  topics: [
    '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
    '0x000000000000000000000000712a63947fb1ecae4658b3908247debf18c5014a',
    '0x000000000000000000000000cd85541698dc95a1b0a246f8a5b21ec3c0d5605b',
  ],
}

describe('AbiDecoder', () => {
  it('loads ABI and decodes log', () => {
    const fs = mockFs({
      readFile: spy(() => JSON.stringify(abi)),
    })
    const abiDecoder = new AbiDecoder(fs)

    abiDecoder.loadAbi(makePath('/deth/abi.json'))

    const decodedLog = abiDecoder.decodeLog(log)
    expect(decodedLog?.signature).to.be.eq('Transfer(address,address,uint256)')
  })

  it('loads multiple ABIs using glob patterns', () => {
    const abiPath = makePath('/deth/a.abi')
    const rootPath = makePath('/deth/')
    const fs = mockFs({
      findFiles: spy(() => {
        return [abiPath]
      }),
      readFile: spy(() => JSON.stringify(abi)),
    })
    const abiDecoder = new AbiDecoder(fs)

    abiDecoder.loadAbis('**/*.abi', rootPath)

    const decodedLog = abiDecoder.decodeLog(log)
    expect(decodedLog?.signature).to.be.eq('Transfer(address,address,uint256)')
    expect(fs.findFiles).to.have.been.calledWithExactly('**/*.abi', rootPath)
    expect(fs.readFile).to.have.been.calledWithExactly(abiPath)
  })

  it('doesnt decode unknown events', () => {
    const fs = mockFs()
    const abiDecoder = new AbiDecoder(fs)

    const decodedLog = abiDecoder.decodeLog(log)
    expect(decodedLog).to.be.undefined
  })
})
