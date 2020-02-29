import VM from 'ethereumts-vm'
import Block from 'ethereumjs-block'
import { ChainOptions } from '../ChainOptions'

export async function putGenesisBlock (vm: VM, options: ChainOptions) {
  const genesisBlock = new Block({
    header: {
      bloom: '0x' + '0'.repeat(512),
      coinbase: options.coinbaseAddress,
      gasLimit: options.blockGasLimit,
      gasUsed: '0x00',
      nonce: 0x42,
      extraData: '0x1337',
      number: 0,
      parentHash: '0x' + '0'.repeat(64),
      timestamp: 0,
    },
  }, { common: vm._common })

  await new Promise((resolve, reject) => {
    vm.blockchain.putGenesis(genesisBlock, (err: unknown) =>
      err != null ? reject(err) : resolve(),
    )
  })
}
