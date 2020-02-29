import { Address, Hash, Quantity, HexData } from './primitives'
import { RpcLogObject } from './RpcLogObject'

export interface RpcTransactionReceipt {
  transactionHash: Hash,
  transactionIndex: Quantity,
  blockHash: Hash,
  blockNumber: Quantity,
  from: Address,
  to?: Address,
  cumulativeGasUsed: Quantity,
  gasUsed: Quantity,
  contractAddress?: Address,
  logs: RpcLogObject[],
  logsBloom: HexData,
  status: Quantity,
}
