import React from 'react'
import { Address } from '@deth/chain'

export interface AddressDisplayProps {
  address: Address
}

export function AddressDisplay ({ address }: AddressDisplayProps) {
  return (
    <a
      href={`/explorer/address/${address}`}
      className="address"
      title={address}
    >
      {address.substring(0, 6)}...{address.substring(38, 42)}
    </a>
  )
}
