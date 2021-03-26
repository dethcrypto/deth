import { Dictionary } from 'ts-essentials'

type ReadonlyDict<T, K extends string | number> = Readonly<
  Dictionary<T | undefined, K>
>

export class CheckpointMap<T, K extends string | number = string> {
  private checkpoints: ReadonlyDict<T, K>[] = []

  constructor(private state: ReadonlyDict<T, K> = {} as any) {}

  checkpoint() {
    this.checkpoints.push(this.state)
  }

  revert() {
    this.state = this.checkpoints.pop()!
  }

  commit() {
    this.checkpoints.pop()
  }

  get(k: K): T | undefined {
    return this.state[k]
  }

  set(k: K, v: T | undefined) {
    this.state = {
      ...this.state,
      [k]: v,
    }
  }

  copy(): CheckpointMap<T, K> {
    return new CheckpointMap(this.state)
  }
}
