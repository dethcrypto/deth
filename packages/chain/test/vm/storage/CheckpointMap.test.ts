import { CheckpointMap } from '../../../src/vm/storage/CheckpointMap'
import { expect } from 'chai'

describe('Checkpoint map', () => {
  it('reads empty values', () => {
    const checkpointMap = new CheckpointMap<number>()

    expect(checkpointMap.get('a')).to.be.eq(undefined)
  })

  it('reads initial values', () => {
    const checkpointMap = new CheckpointMap<number>({ a: 1 })

    expect(checkpointMap.get('a')).to.be.eq(1)
  })

  it('reads written values', () => {
    const checkpointMap = new CheckpointMap<number>()

    checkpointMap.set('a', 2)

    expect(checkpointMap.get('a')).to.be.eq(2)
  })

  it('reads written values after checkpoint', () => {
    const checkpointMap = new CheckpointMap<number>()

    checkpointMap.set('a', 2)
    checkpointMap.checkpoint()

    expect(checkpointMap.get('a')).to.be.eq(2)
  })

  it('reads written values after commit', () => {
    const checkpointMap = new CheckpointMap<number>()

    checkpointMap.set('a', 2)
    checkpointMap.checkpoint()
    checkpointMap.set('a', 3)
    expect(checkpointMap.get('a')).to.be.eq(3)

    checkpointMap.commit()

    expect(checkpointMap.get('a')).to.be.eq(3)
  })

  it('reads written values after revert', () => {
    const checkpointMap = new CheckpointMap<number>()

    checkpointMap.set('a', 2)
    checkpointMap.checkpoint()
    checkpointMap.set('a', 3)
    checkpointMap.revert()

    expect(checkpointMap.get('a')).to.be.eq(2)
  })
})
