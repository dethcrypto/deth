import { range, flatten } from 'lodash'

import { Snapshot } from '../../utils/Snapshot'
import { DethStateManger } from './DethStateManger'
import { DethBlockchain } from './DethBlockchain'
import { RpcBlockResponse, numberToQuantity, toBlockResponse, RpcTransactionReceipt } from '../../model'
import { isByBlockRequest, FilterRequest, RpcLogObject } from '../..'

export class BlockchainRepository {
  constructor (private readonly state: Snapshot<{ stateManger: DethStateManger, blockchain: DethBlockchain }>) {}

  // @todo: super slow impl
  getAllReceipts (blocks: RpcBlockResponse[]): RpcTransactionReceipt[] {
    const validBlockHashes = blocks.map(b => b.hash)

    const receipts: RpcTransactionReceipt[] = []
    for (const receipt of this.state.value.blockchain.receipts.values()) {
      if (validBlockHashes.includes(receipt.blockHash)) {
        receipts.push(receipt)
      }
    }

    return receipts
  }

  getLogs (filter: FilterRequest): RpcLogObject[] {
    const blocks: RpcBlockResponse[] = []
    if (isByBlockRequest(filter)) {
      blocks.push(toBlockResponse(this.state.value.blockchain.getBlockByHash(filter.blockHash!)))
    } else {
      // TODO: fix handling for tags!
      blocks.push(...this.getBlockByRange(filter.fromBlock as any, (filter.toBlock as any)!))
    }

    const receipts = this.getAllReceipts(blocks)
    let logs = flatten(receipts.map(r => r.logs))

    if (filter.address) {
      logs = logs.filter(r => r.address === filter.address)
    }

    if (filter.topics) {
      // @todo implement
      throw new Error('unimplemented')
      // logs = logs.filter(r => r.topics)
    }

    return logs
  }

  getBlockByRange (start: number, _last?: number): RpcBlockResponse[] {
    const last = _last ?? this.state.value.blockchain.getBlockNumber()
    return range(start, last)
      .map(n => this.state.value.blockchain.getBlockByNumber(numberToQuantity(n)))
      .map(toBlockResponse)
  }
}
