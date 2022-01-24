import { Block } from '@ethereumjs/block'
import type { BlockHeaderData } from '@ethereumjs/block'

export function dummyBlock(nonce: number) {
  const header: BlockHeaderData = {
    nonce,
  }

  return new Block({ header })
}
