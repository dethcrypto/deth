/* eslint-disable max-len */
import { Address, HexString, Hash, Quantity } from '../primitives'

// https://github.com/ethers-io/ethers.js/blob/4ac08432b8e2c7c374dc4a0e141a39a369e2d430/src.ts/providers/base-provider.ts#L184
export interface TransactionResponse {
  hash: Hash,
  blockHash: Hash, // originally optional
  blockNumber: Quantity, // originally optional
  transactionIndex: Quantity, // originally optional
  // SKIP: confirmations? number - ethers automatically calculates this
  from: Address,
  gasPrice: Quantity,
  gasLimit: Quantity,
  to?: Address,
  value: Quantity,
  nonce: Quantity,
  data: HexString,
  r: HexString,
  s: HexString,
  v: HexString, // originally optional
  creates?: Address,
  // SKIP: raw?: HexString - ethers automatically calculates this
  // https://github.com/ethers-io/ethers.js/blob/4ac08432b8e2c7c374dc4a0e141a39a369e2d430/src.ts/providers/base-provider.ts#L230
  networkId: number, // originally optional
}
