import { Dictionary } from 'ts-essentials'
import { cloneDeep } from 'lodash'

import { SnapshotObject } from '../../../src/vm/storage/SnapshotObject'
import { expect } from 'chai'

describe('SnapshotObject', () => {
  it('reverts to snapshot', () => {
    const snapshotObject = new SnapshotObject({} as Dictionary<number>, cloneDeep)

    snapshotObject.value.key = 1
    const snapshotId = snapshotObject.makeSnapshot()

    snapshotObject.value.key = 2
    snapshotObject.revert(snapshotId)

    expect(snapshotObject.value.key).to.be.eq(1)
  })
})
