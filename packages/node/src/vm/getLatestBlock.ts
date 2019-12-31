import VM from 'ethereumjs-vm'
import Block from 'ethereumjs-block'

export function getLatestBlock (vm: VM): Promise<Block> {
  return new Promise((resolve, reject) => {
    vm.blockchain.getLatestBlock((err: unknown, block: Block) => {
      if (err) reject(err)
      resolve(block)
    })
  })
}
