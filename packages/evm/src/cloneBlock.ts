import { Bytes20, Bytes32, Account, Block } from './model'

export function cloneBlock (block: Block): Block {
  return {
    parent: block.parent,
    accounts: cloneAccounts(block.accounts),
    transactions: [...block.transactions],
    parameters: { ...block.parameters },
  }
}

function cloneAccounts (accounts: Map<Bytes20, Account>) {
  const clone = new Map<Bytes20, Account>()
  for (const [address, account] of accounts) {
    clone.set(address, cloneAccount(account))
  }
  return clone
}

function cloneAccount (account: Account): Account {
  return {
    balance: account.balance,
    code: account.code,
    nonce: account.nonce,
    storage: cloneStorage(account.storage),
  }
}

function cloneStorage (storage: Map<Bytes32, Bytes32>) {
  return new Map<Bytes32, Bytes32>(storage)
}
