import { Chain, makeHexData } from '@dethnode/chain'
import { WalletManager } from './WalletManager'
import { utils } from 'ethers'

export async function fakeHistory(chain: Chain, walletManager: WalletManager) {
  const wallets = walletManager.getWallets()
  const nonces = new Array(wallets.length).fill(0)

  chain.stopAutoMining()

  const blockCount = randInt(5, 20)
  for (let i = 0; i < blockCount; i++) {
    const transactionCount = randInt(0, 5)
    for (let j = 0; j < transactionCount; j++) {
      const sender = randInt(0, wallets.length)
      const recipient = randInt(0, wallets.length)
      const tx = await wallets[sender].sign({
        to: wallets[recipient].address,
        nonce: nonces[sender]++,
        gasLimit: 21000,
        gasPrice: utils.bigNumberify(1e9),
        data: '',
        chainId: 1337,
        value: utils.parseEther(randInt(1, 4).toString()),
      })
      await chain.sendTransaction(makeHexData(tx))
    }
    await chain.mineBlock()
  }
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min
}
