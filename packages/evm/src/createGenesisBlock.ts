import { Block, Bytes20, Bytes32, Account } from './model'

export interface GenesisBlockParams {
  balances: Map<Bytes20, Bytes32>,
}

export function createGenesisBlock (params: GenesisBlockParams): Block {
  return {
    parent: undefined,
    accounts: accountsFromBalances(params.balances),
    transactions: new Map(),
  }
}

function accountsFromBalances (balances: Map<Bytes20, Bytes32>) {
  const accounts = new Map<Bytes20, Account>()
  for (const [address, balance] of balances) {
    accounts.set(address, {
      balance,
      storage: new Map(),
      nonce: 0,
      code: '0x',
    })
  }
  return accounts
}
