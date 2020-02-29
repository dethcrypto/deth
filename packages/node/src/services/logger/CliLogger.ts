import { gray, yellow, red, blue, green } from 'chalk'

import { HexData, Address, makeAddress } from '@deth/chain'
import { AbiDecoder } from '../AbiDecoder'
import { DethLogger } from './DethLogger'
import { WalletManager } from '../WalletManager'

export class CliLogger implements DethLogger {
  constructor (private readonly abiDecoder: AbiDecoder) {}

  logTransaction (tx: { to?: Address, from: Address, data?: HexData }) {
    const deploying = tx.to === undefined
    const data = deploying ? tx.data : undefined
    const decoded = data ? this.abiDecoder.decodeCalldata(data) : undefined

    console.log(
      header('TX'),
      `From ${formatAddress(tx.from)} to ${tx.to ? formatAddress(tx.to) : '[NEW CONTRACT]'} ${
        decoded ? `with ${blue(decoded.signature)}` : ''
      }`,
    )
  }

  logEvent (data: string, topics: string[]) {
    const decodedLog = this.abiDecoder.decodeLog({
      data,
      topics,
    })

    if (decodedLog) {
      // @todo improve output here
      console.log(header('LOG'), blue(decodedLog.signature), stringifyEthersValue(decodedLog.values))
    } else {
      console.log(header('LOG'), '(unrecognized)')
    }
  }

  logRevert (reason: string, address: Address) {
    console.log(header('REVERT'), red(`Reason ${reason} on ${formatAddress(address)}`))
  }

  logNodeInfo (walletManager: WalletManager): void {
    const wallets = walletManager.getWallets()

    console.log(`Unlocked wallets: ${green(wallets.length)}`)

    console.log('No:\t Address:\t Private key:')
    for (const [i, wallet] of wallets.entries()) {
      console.log(`${i}\t ${yellow(makeAddress(wallet.address))}\t ${wallet.privateKey}`)
    }
    console.log('')
  }
}

function header (name: string) {
  return gray(`[${name}]\t`)
}

function stringifyEthersValue (value: any) {
  const result: string[] = []
  for (let i = 0; i < value.length; i++) {
    result.push(value[i])
  }
  return result.join(', ')
}

function formatAddress (address: Address) {
  return yellow(`${address.substring(0, 6)}...${address.substring(address.length - 4)}`)
}
