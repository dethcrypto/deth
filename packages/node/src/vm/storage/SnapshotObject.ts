/**
 * Object that can be snapshotted ("saved") any time and then reverted to a given state.
 */
export class SnapshotObject<T> {
  private snapshots: T[] = []

  constructor (public value: T, private copyFn: (t: T) => T) {}

  makeSnapshot () {
    const copy = this.copyFn(this.value)
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
