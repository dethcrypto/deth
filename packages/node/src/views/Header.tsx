import React from 'react'

export function Header() {
  return (
    <header className="header">
      <div className="header__content">
        <p className="header__brand">
          Deth{' '}
          <span className="header__brand-subtitle">
            Blockchain Explorer
          </span>
        </p>
        <form
          className="header__search-form"
          action="/explorer/search"
        >
          <input
            className="header__search-input"
            placeholder="Search block or transaction hash"
            name="query"
          />
        </form>
      </div>
    </header>
  )
}
