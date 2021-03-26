import React from 'react'
import { BlockListItem } from '../services/Explorer'
import { HashDisplay } from './HashDisplay'

export interface BlockTableProps {
  blocks: BlockListItem[]
}

export function BlockTable({ blocks }: BlockTableProps) {
  return (
    <div className="table__wrapper table__wrapper--small">
      <table className="table">
        <thead>
          <tr>
            <th className="table__right">Number</th>
            <th className="table__left">Hash</th>
            <th className="table__right">Transactions</th>
          </tr>
        </thead>
        <tbody>
          {blocks.map((block, i) => (
            <Block block={block} key={i} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Block({ block }: { block: BlockListItem }) {
  const link = `/explorer/blocks/${block.hash}`
  return (
    <tr>
      <td className="table__right">
        <a href={link}>{block.number}</a>
      </td>
      <td className="table__left">
        <a href={link}>
          <HashDisplay hash={block.hash} />
        </a>
      </td>
      <td className="table__right">{block.transactionCount}</td>
    </tr>
  )
}
