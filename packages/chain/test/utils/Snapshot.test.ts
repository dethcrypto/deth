import { Dictionary } from 'ts-essentials'
import { cloneDeep } from 'lodash'

import { Snapshot } from '../../src/utils/Snapshot'
import { expect } from 'chai'

describe('Snapshot', () => {
  it('reverts to snapshot', () => {
    const snapshotObject = new Snapshot({} as Dictionary<number>, cloneDeep)

    snapshotObject.value.key = 1
    const snapshotId = snapshotObject.save()

    snapshotObject.value.key = 2
    snapshotObject.revert(snapshotId)

    expect(snapshotObject.value.key).to.be.eq(1)
  })

  it('can revert to any state', () => {
    const snapshotObject = new Snapshot(420, x => x)
    const first = snapshotObject.save()
    snapshotObject.value = 21
    const second = snapshotObject.save()
    snapshotObject.value = 37
    const third = snapshotObject.save()

    snapshotObject.revert(first)
    expect(snapshotObject.value).to.equal(420)
    snapshotObject.revert(second)
    expect(snapshotObject.value).to.equal(21)
    snapshotObject.revert(third)
    expect(snapshotObject.value).to.equal(37)
  })
})
