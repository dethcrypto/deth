import Block from 'ethereumjs-block'
import { Transaction } from 'ethereumjs-tx'
import {
  bufferToHash,
  bufferToAddress,
  bufferToMaybeAddress,
  bufferToHexString,
  bufferToQuantity,
  bnToQuantity,
  numberToQuantity,
} from '../utils'
import BN from 'bn.js'
import {
  TransactionResponse,
  TransactionReceiptLogResponse,
  TransactionReceiptResponse,
  makeQuantity,
} from '../model'
import { NETWORK_ID } from '../constants'

export function getReceiptsAndResponses (
  block: Block,
  transactions: Transaction[],
  results: any[],
) {
  const blockHash = bufferToHash(block.hash())
  const blockNumber = bufferToQuantity(block.header.number)

  let cumulativeGasUsed = new BN(0)

  const responses: TransactionResponse[] = []
  const receipts: TransactionReceiptResponse[] = []

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
      gasLimit: bufferToQuantity(tx.gasLimit),
      to,
      value: bufferToQuantity(tx.value),
      nonce: bufferToQuantity(tx.nonce),
      data: bufferToHexString(tx.data),
      r: bufferToHexString(tx.r),
      s: bufferToHexString(tx.s),
      v: bufferToHexString(tx.v),
      creates: created,
      networkId: NETWORK_ID,
    })

    // result.execResult.logs // TODO: correct format
    const logs: TransactionReceiptLogResponse[] = []

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
      logsBloom: bufferToHexString(result.bloom.bitvector),
      root: undefined, // TODO: this
      status: makeQuantity('0x1'), // TODO: this
    })
  }

  return {
    receipts,
    responses,
  }
}
