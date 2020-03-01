import React from 'react'
import { BlockListItem } from '../services/Explorer'
import { Hash } from './Hash'

export interface HomeProps {
  blocks: BlockListItem[]
}

export function Home ({ blocks }: HomeProps) {
  return (
    <>
      <Header />
      <main className="content">
        <section>
          <h2>Latest Blocks</h2>
          <table className="table">
            <thead>
              <tr>
                <th className="table__right">Number</th>
                <th>Hash</th>
                <th className="table__right">Transactions</th>
              </tr>
            </thead>
            <tbody>
              {blocks.map((block, i) => <Block block={block} key={i} />)}
            </tbody>
          </table>
        </section>
      </main>
    </>
  )
}

function Block ({ block }: { block: BlockListItem }) {
  const link = `/explorer/blocks/${block.hash}`
  return (
    <tr>
      <td className="table__right"><a href={link}>{block.number}</a></td>
      <td><a href={link}><Hash hash={block.hash} /></a></td>
      <td className="table__right">{block.transactionCount}</td>
    </tr>
  )
}

function Header () {
  return (
    <header className="header">
      <h1>Deth Chain Explorer</h1>
    </header>
  )
}
