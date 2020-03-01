import React from 'react'
import { BlockListItem, TransactionListItem } from '../services/Explorer'
import { TransactionTable } from './TransactionTable'
import { BlockTable } from './BlockTable'
import { Page } from './Page'

export interface HomeProps {
  blocks: BlockListItem[],
  transactions: TransactionListItem[],
}

export function Home ({ blocks, transactions }: HomeProps) {
  return (
    <Page twoColumns>
      <section className="page__column">
        <h2 className="page__title">Latest Blocks</h2>
        <div className="block">
          <BlockTable blocks={blocks} />
          <a className="block__more" href="/explorer/blocks">
            View all blocks →
          </a>
        </div>
      </section>
      <section className="page__column">
        <h2 className="page__title">Latest Transactions</h2>
        <div className="block">
          <TransactionTable transactions={transactions} />
          <a className="block__more" href="/explorer/transactions">
            View all transactions →
          </a>
        </div>
      </section>
    </Page>
  )
}
