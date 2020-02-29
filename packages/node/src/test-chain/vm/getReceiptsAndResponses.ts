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
} from '../../primitives'
import BN from 'bn.js'
import { RpcTransactionResponse, RpcLogObject, RpcTransactionReceipt } from '../../model'
// eslint-disable-next-line
import { RunTxResult } from 'ethereumts-vm/dist/runTx'

export function getReceiptsAndResponses (block: Block, transactions: Transaction[], results: RunTxResult[]) {
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

    const logs: RpcLogObject[] = (result.execResult.logs || []).map((rawData, index: number) => {
      const [_address, _topics, _data] = rawData

      return {
        removed: false,
        logIndex: numberToQuantity(index),
        blockNumber,
        transactionIndex,
        transactionHash: hash,
        blockHash,
        data: bufferToHexData(_data),
        address: bufferToAddress(_address),
        topics: _topics.map(bufferToHash),
      }
    })

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
      status: numberToQuantity(result.execResult.exceptionError ? 0 : 1),
    })
  }

  return {
    receipts,
    responses,
  }
}
