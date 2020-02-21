import { Address, HexData } from '../../primitives'

export interface DethLogger {
  logTransaction(tx: { to?: Address, from: Address, data?: HexData }): void,

  logEvent(data: string, topics: string[]): void,

  logRevert(reason: string, address: Address): void,
}
