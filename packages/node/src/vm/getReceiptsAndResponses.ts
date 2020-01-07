import Block from 'ethereumjs-block'
import { Transaction } from 'ethereumjs-tx'
import {
  bufferToHash,
  bufferToAddress,
  bufferToMaybeAddress,
  bufferToQuantity,
  bnToQuantity,
  numberToQuantity,
  bufferToHexData,
} from '../primitives'
import BN from 'bn.js'
import {
  RpcTransactionResponse,
  RpcLogObject,
  RpcTransactionReceipt,
} from '../model'

export function getReceiptsAndResponses (
  block: Block,
  transactions: Transaction[],
  results: any[], // eslint-disable-line @typescript-eslint/no-explicit-any
) {
  const blockHash = bufferToHash(block.hash())
  const blockNumber = bufferToQuantity(block.header.number)

  let cumulativeGasUsed = new BN(0)

  const responses: RpcTransactionResponse[] = []
  const receipts: RpcTransactionReceipt[] = []

  for (let i = 0; i < transactions.length; i++) {
    const tx = transactions[i]
    const result = results[i]
    const hash = bufferToHash(tx.hash())

    const from = bufferToAddress(tx.getSenderAddress())
    const to = bufferToMaybeAddress(tx.to)
    const created = bufferToMaybeAddress(result.createdAddress)

    const gasUsed = new BN(result.gasUsed)
    cumulativeGasUsed = cumulativeGasUsed.add(gasUsed)

    const transactionIndex = numberToQuantity(i)

    responses.push({
      hash,
      blockHash,
      blockNumber,
      transactionIndex,
      from,
      gasPrice: bufferToQuantity(tx.gasPrice),
      gas: bufferToQuantity(tx.gasLimit),
      to,
      value: bufferToQuantity(tx.value),
      nonce: bufferToQuantity(tx.nonce),
      input: bufferToHexData(tx.data),
      r: bufferToQuantity(tx.r),
      s: bufferToQuantity(tx.s),
      v: bufferToQuantity(tx.v),
    })

    // result.execResult.logs // TODO: correct format
    const logs: RpcLogObject[] = []

    receipts.push({
      blockHash,
      blockNumber,
      cumulativeGasUsed: bnToQuantity(cumulativeGasUsed),
      gasUsed: bnToQuantity(gasUsed),
      logs,
      transactionHash: hash,
      transactionIndex,
      contractAddress: created,
      from,
      to,
      logsBloom: bufferToHexData(result.bloom.bitvector),
      status: numberToQuantity(1), // TODO: this
    })
  }

  return {
    receipts,
    responses,
  }
}
