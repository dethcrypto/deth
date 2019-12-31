import { Quantity, Hash, Address, HexData } from "../primitives";

export interface RpcLogObject {
  removed: boolean,
  logIndex: Quantity,
  transactionIndex: Quantity,
  transactionHash: Hash,
  blockHash: Hash,
  blockNumber: Quantity,
  address: Address,
  data: HexData,
  topics: Hash[],
}
