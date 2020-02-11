import { Dictionary } from 'ts-essentials'
import { cloneDeep } from 'lodash'

export class SnapshotObject<T extends Dictionary<any> | { copy(): any }> {
  private snapshots: T[] = [];

  constructor (public value: T) {}

  makeSnapshot () {
    const copy = this.value.copy ? this.value.copy() : cloneDeep(this.value)
    const id = this.makeSnapshot.length
    this.snapshots.push(copy)
    return id
  }

  revert (id: number) {
    if (this.makeSnapshot.length < id) {
      throw new Error(`Snapshot id ${id} doesn't exist`)
    }

    this.value = this.snapshots[id]
  }
}
