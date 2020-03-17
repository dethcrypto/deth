const HEX_REGEX = /^[a-f\d]*$/i

export class Bytes {
  private constructor (private value: string) {}

  static fromString (value: string) {
    if (!HEX_REGEX.test(value) || value.length % 2 !== 0) {
      throw new TypeError('Invalid value')
    }
    return new Bytes(value.toLowerCase())
  }

  equals (other: Bytes) {
    return this.value === other.value
  }

  getByte (index: number) {
    return this.value[index * 2] + this.value[index * 2 + 1]
  }

  getByteInt (index: number) {
    return parseInt(this.getByte(index), 16)
  }

  getLength () {
    return this.value.length / 2
  }

  slice (start: number, end: number) {
    return new Bytes(this.value.slice(start * 2, end * 2))
  }

  concat (other: Bytes) {
    return new Bytes(this.value + other.value)
  }

  toHex () {
    return this.value
  }
}
