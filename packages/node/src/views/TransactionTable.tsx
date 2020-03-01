import React from 'react'
import { TransactionListItem } from "../services/Explorer"
import { HashDisplay } from "./HashDisplay"
import { utils } from "ethers"
import { AddressDisplay } from './AddressDisplay'

export interface TransactionTableProps {
  transactions: TransactionListItem[]
}

export function TransactionTable ({ transactions }: TransactionTableProps) {
  return (
    <div className="table__wrapper table__wrapper--small">
      <table className="table">
        <thead>
          <tr>
            <th className="table__right">Block</th>
            <th className="table__left">Hash</th>
            <th className="table__left">Accounts</th>
            <th className="table__right">Value</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, i) => (
            <Transaction transaction={transaction} key={i} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Transaction({ transaction }: { transaction: TransactionListItem }) {
  const blockLink = `/explorer/blocks/${transaction.blockHash}`
  const txLink = `/explorer/transactions/${transaction.hash}`

  return (
    <tr>
      <td className="table__right">
        <a href={blockLink}>{transaction.blockNumber}</a>
      </td>
      <td className="table__left">
        <a href={txLink}><HashDisplay hash={transaction.hash} /></a>
      </td>
      <td className="table__left tx-address">
        <div>
          <span className="tx-address__label">from</span>
          <AddressDisplay address={transaction.from} />
        </div>
        <div>
          <span className="tx-address__label">to</span>
          <AddressDisplay address={transaction.to} />
        </div>
      </td>
      <td className="table__right">
        {utils.formatEther(transaction.value)}
      </td>
    </tr>
  )
}

