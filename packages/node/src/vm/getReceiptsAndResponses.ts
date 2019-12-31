import Block from 'ethereumjs-block'
import { Transaction } from 'ethereumjs-tx'
import { bufferToHash, bufferToAddress, bufferToMaybeAddress, bufferToHexString } from '../utils'
import { bufferToInt } from 'ethereumjs-util'
import { utils } from 'ethers'
import { TransactionResponse, TransactionReceiptLogResponse, TransactionReceiptResponse } from '../model'
import { NETWORK_ID } from '../constants'

export function getReceiptsAndResponses (
  block: Block,
  transactions: Transaction[],
  results: any[],
) {
  const blockHash = bufferToHash(block.hash())
  const blockNumber = bufferToInt(block.header.number)

  let cumulativeGasUsed = utils.bigNumberify(0)

  const responses: TransactionResponse[] = []
  const receipts: TransactionReceiptResponse[] = []

  for (let i = 0; i < transactions.length; i++) {
    const tx = transactions[i]
    const result = results[i]
    const hash = bufferToHash(tx.hash())

    const from = bufferToAddress(tx.getSenderAddress())
    const to = bufferToMaybeAddress(tx.to)
    const created = bufferToMaybeAddress(result.createdAddress)

    const gasUsed = utils.bigNumberify(bufferToInt(result.gasUsed))
    cumulativeGasUsed = cumulativeGasUsed.add(gasUsed)

    responses.push({
      hash,
      blockHash,
      blockNumber,
      transactionIndex: i,
      from,
      gasPrice: utils.bigNumberify(tx.gasPrice),
      gasLimit: utils.bigNumberify(tx.gasLimit),
      to,
      value: utils.bigNumberify(tx.value),
      nonce: bufferToInt(tx.nonce),
      data: bufferToHexString(tx.data),
      r: bufferToHexString(tx.r),
      s: bufferToHexString(tx.s),
      v: bufferToInt(tx.v),
      creates: created,
      networkId: NETWORK_ID,
    })

    // result.execResult.logs // TODO: correct format
    const logs: TransactionReceiptLogResponse[] = []

    receipts.push({
      blockHash,
      blockNumber,
      cumulativeGasUsed,
      gasUsed,
      logs,
      transactionHash: hash,
      transactionIndex: i,
      contractAddress: created,
      from,
      to,
      logsBloom: bufferToHexString(result.bloom.bitvector),
      root: undefined, // TODO: this
      status: 1, // TODO: this
    })
  }

  return {
    receipts,
    responses,
  }
}
