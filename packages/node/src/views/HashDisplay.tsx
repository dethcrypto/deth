import React from 'react'
import { Hash } from '@dethnode/chain'

export interface HashDisplayProps {
  hash: Hash
}

export function HashDisplay ({ hash }: HashDisplayProps) {
  const parts: string[] = []
  for (let i = 0; i < 10; i++) {
    parts.push(hash.substring((i + 1) * 6, (i + 2) * 6))
  }

  return (
    <span className="hash" title={hash}>
      <span>{hash.substring(0, 4)}</span>
      {parts.map((part, i) => (
        <span
          className="hash__part"
          style={{ backgroundColor: '#' + part }}
          key={i}
        >
          {part}
        </span>
      ))}
      <span>{hash.substring(64, 66)}</span>
    </span>
  )
}
