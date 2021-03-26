import React, { ReactNode } from 'react'
import cx from 'classnames'
import { Header } from './Header'

export interface PageProps {
  children: ReactNode
  twoColumns?: boolean
}

export function Page({ children, twoColumns }: PageProps) {
  return (
    <>
      <Header />
      <main className={cx('page', twoColumns && 'page--two-columns')}>
        {children}
      </main>
    </>
  )
}
