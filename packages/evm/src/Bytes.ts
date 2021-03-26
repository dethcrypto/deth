const HEX_REGEX = /^[a-f\d]*$/i

export class Bytes {
  private constructor(private value: string) {}

  static EMPTY = new Bytes('')

  static fromString(value: string) {
    if (!HEX_REGEX.test(value) || value.length % 2 !== 0) {
      throw new TypeError('Invalid value')
    }
    return new Bytes(value.toLowerCase())
  }

  static fromNumber(value: number) {
    return new Bytes(numberToHex(value))
  }

  static fromByteIntArray(value: number[]) {
    return new Bytes(value.map(numberToHex).join(''))
  }

  equals(other: Bytes) {
    return this.value === other.value
  }

  toByteIntArray() {
    const array = new Array<number>(this.length)
    for (let i = 0; i < this.length; i++) {
      array[i] = this.getByteInt(i)
    }
    return array
  }

  getByte(index: number) {
    return this.value[index * 2] + this.value[index * 2 + 1]
  }

  getByteInt(index: number) {
    return parseInt(this.getByte(index), 16)
  }

  get length() {
    return this.value.length / 2
  }

  slice(start: number, end: number) {
    return new Bytes(this.value.slice(start * 2, end * 2))
  }

  concat(other: Bytes) {
    return new Bytes(this.value + other.value)
  }

  toHex() {
    return this.value
  }
}

function numberToHex(value: number) {
  const hex = value.toString(16)
  return hex.length % 2 === 0 ? hex : '0' + hex
}
