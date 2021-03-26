import { ethers, utils } from 'ethers'

import { Path } from './fs/Path'
import { FileSystem } from './fs/FileSystem'

// silence ethers warnings: https://github.com/ethers-io/ethers.js/issues/407
ethers.errors.setLogLevel('error')

import debug from 'debug'
const d = debug('deth:AbiDecoder')

interface SimpleLog {
  topics: string[]
  data: string
}

export class AbiDecoder {
  constructor(private readonly fs: FileSystem) {}
  // note: this should be modified only by addAbi method
  private readonly ABIs = new Set<any>()
  private iface = new ethers.utils.Interface([...this.ABIs.values()])

  loadAbi(path: Path): void {
    const rawAbi = this.fs.readFile(path)
    this.addAbi(JSON.parse(rawAbi))
    this.iface = new ethers.utils.Interface([...this.ABIs.values()])
  }

  loadAbis(glob: string, basePath: Path): void {
    const abiPaths = this.fs.findFiles(glob, basePath)
    d(`Loading (${abiPaths.length}) matched by ${glob} from ${basePath}`)
    const rawAbis = abiPaths.map((p) => this.fs.readFile(p))

    for (const rawAbi of rawAbis) {
      this.addAbi(JSON.parse(rawAbi))
    }
    this.iface = new ethers.utils.Interface([...this.ABIs.values()])
  }

  addAbi(abi: object[]) {
    for (const a of abi) {
      this.ABIs.add(a)
    }
  }

  decodeLog(log: SimpleLog): utils.LogDescription | undefined {
    return this.iface.parseLog(log) ?? undefined // note: ethers returns null by default
  }

  decodeCalldata(data: string): utils.TransactionDescription | undefined {
    return this.iface.parseTransaction({ data }) ?? undefined // note: ethers returns null by default
  }
}
