import { MachineWord } from './MachineWord'

export class Storage {
  private safe = new Map<string, MachineWord>()
  private volatile = new Map<string, MachineWord>()

  get (key: MachineWord) {
    const keyStr = key.toHexString()
    return (
      this.volatile.get(keyStr) ||
      this.safe.get(keyStr) ||
      MachineWord.ZERO
    )
  }

  set (key: MachineWord, value: MachineWord) {
    const keyStr = key.toHexString()
    this.volatile.set(keyStr, value)
  }

  commit () {
    for (const [key, value] of this.volatile) {
      this.safe.set(key, value)
    }
    this.revert()
  }

  revert () {
    this.volatile = new Map()
  }

  clone () {
    const result = new Storage()
    result.safe = new Map(this.safe)
    result.volatile = this.volatile
    result.commit()
    return result
  }
}
