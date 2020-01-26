import Block, { BlockHeaderData } from 'ethereumjs-block'

export function dummyBlock (nonce: number) {
  const header: BlockHeaderData = {
    nonce,
  }

  return new Block({ header })
}
