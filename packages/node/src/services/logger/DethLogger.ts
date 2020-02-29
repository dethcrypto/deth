import { Address, HexData } from '@deth/chain'
import { WalletManager } from '../WalletManager'

export interface DethLogger {
  logTransaction(tx: { to?: Address, from: Address, data?: HexData }): void,

  logEvent(data: string, topics: string[]): void,

  logRevert(reason: string, address: Address): void,

  logNodeInfo(walletManager: WalletManager): void,
}
