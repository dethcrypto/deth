export interface Listener<T> {
  (event: T): void,
}

export class EventEmitter<T> {
  private listeners: Listener<T>[] = []

  emit (event: T) {
    this.listeners.forEach(listener => listener(event))
  }

  addListener (listener: Listener<T>) {
    this.listeners.push(listener)
    return () => {
      this.listeners.splice(this.listeners.indexOf(listener), 1)
    }
  }
}
