import { Address, Hash, Quantity, HexData } from '../primitives'
import { RpcLogObject } from './RpcLogObject'

export interface RpcTransactionReceipt {
  transactionHash: Hash,
  transactionIndex: Quantity,
  blockHash: Hash,
  blockNumber: Quantity,
  from: Address,
  to: Address | null,
  cumulativeGasUsed: Quantity,
  gasUsed: Quantity,
  contractAddress: Address | null,
  logs: RpcLogObject[],
  logsBloom: HexData,
  status: Quantity,
}
