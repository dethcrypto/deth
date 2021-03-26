/** Value that can be saved any time and then reverted back. */
export class Snapshot<T> {
  private snapshots: T[] = []

  constructor(public value: T, private copy: (value: T) => T) {}

  save() {
    const id = this.snapshots.length
    this.snapshots.push(this.copy(this.value))
    return id
  }

  revert(id: number) {
    if (this.snapshots.length < id) {
      throw new Error(`Snapshot id ${id} doesn't exist`)
    }
    this.value = this.snapshots[id]
  }
}
