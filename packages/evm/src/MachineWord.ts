import BN from 'bn.js'

const TWO_POW256 = new BN('1' + '0'.repeat(64), 16)
const MAX_256 = new BN('f'.repeat(64), 16)

export class MachineWord {
  private constructor (private value: BN) {
  }

  static ZERO = new MachineWord(new BN(0))
  static ONE = new MachineWord(new BN(1))
  static MAX = new MachineWord(MAX_256)

  static fromBoolean (value: boolean) {
    return value ? MachineWord.ONE : MachineWord.ZERO
  }

  static fromHexString (value: string) {
    // TODO: error check for size
    return new MachineWord(new BN(value, 16))
  }

  toHexString () {
    return this.value.toString(16, 64)
  }

  private get signed () {
    return this.value.fromTwos(256)
  }

  add (other: MachineWord) {
    const result = this.value
      .add(other.value)
      .mod(TWO_POW256)
    return new MachineWord(result)
  }

  subtract (other: MachineWord) {
    const result = this.value
      .sub(other.value)
      .toTwos(256)
    return new MachineWord(result)
  }

  multiply (other: MachineWord) {
    const result = this.value
      .mul(other.value)
      .mod(TWO_POW256)
    return new MachineWord(result)
  }

  unsignedDivide (other: MachineWord) {
    if (other.isZero()) {
      return MachineWord.ZERO
    }
    const result = this.value
      .div(other.value)
    return new MachineWord(result)
  }

  signedDivide (other: MachineWord) {
    if (other.isZero()) {
      return MachineWord.ZERO
    }
    const result = this.signed
      .div(other.signed)
      .toTwos(256)
    return new MachineWord(result)
  }

  unsignedModulo (other: MachineWord) {
    if (other.isZero()) {
      return MachineWord.ZERO
    }
    const result = this.value
      .mod(other.value)
    return new MachineWord(result)
  }

  signedModulo (other: MachineWord) {
    if (other.isZero()) {
      return MachineWord.ZERO
    }

    const intermediate = this.signed.abs().mod(other.signed.abs())
    const result = this.signed.isNeg()
      ? intermediate.ineg().toTwos(256)
      : intermediate
    return new MachineWord(result)
  }

  exponentiate (power: MachineWord) {
    if (power.isZero()) {
      return MachineWord.ONE
    }
    if (this.isZero()) {
      return MachineWord.ZERO
    }
    const redBase = this.value.toRed(BN.red(TWO_POW256))
    const result = redBase.redPow(power.value)
    return new MachineWord(result)
  }

  extendSign (bytes: MachineWord) {
    if (bytes.value.gten(31)) {
      return this
    }
    const signBit = bytes.value
      .muln(8)
      .iaddn(7)
      .toNumber()
    const mask = new BN(1).ishln(signBit).isubn(1)
    const result = this.value.testn(signBit)
      ? this.value.or(mask.notn(256))
      : this.value.and(mask)
    return new MachineWord(result)
  }

  unsignedLessThan (other: MachineWord) {
    return this.value.lt(other.value)
  }

  signedLessThan (other: MachineWord) {
    return this.signed.lt(other.signed)
  }

  unsignedGreaterThan (other: MachineWord) {
    return this.value.gt(other.value)
  }

  signedGreaterThan (other: MachineWord) {
    return this.signed.gt(other.signed)
  }

  equals (other: MachineWord) {
    return this.value.eq(other.value)
  }

  isZero () {
    return this.value.isZero()
  }

  and (other: MachineWord) {
    const result = this.value.and(other.value)
    return new MachineWord(result)
  }

  or (other: MachineWord) {
    const result = this.value.or(other.value)
    return new MachineWord(result)
  }

  xor (other: MachineWord) {
    const result = this.value.xor(other.value)
    return new MachineWord(result)
  }

  not () {
    const result = this.value.notn(256)
    return new MachineWord(result)
  }

  getByte (position: MachineWord) {
    if (position.value.gten(32)) {
      return MachineWord.ZERO
    }
    // for some reason the actual type of result is number!
    const result = this.value
      .shrn((31 - position.value.toNumber()) * 8)
      .andln(0xff)
    return new MachineWord(new BN(result))
  }

  shiftLeft (by: MachineWord) {
    if (by.value.gten(256)) {
      return MachineWord.ZERO
    }
    const result = this.value.shln(by.value.toNumber()).iand(MAX_256)
    return new MachineWord(result)
  }

  logicalShiftRight (by: MachineWord) {
    if (by.value.gten(256)) {
      return MachineWord.ZERO
    }
    const result = this.value.shrn(by.value.toNumber())
    return new MachineWord(result)
  }

  arithmeticShiftRight (by: MachineWord) {
    const isSigned = this.value.testn(255)
    if (by.value.gten(256)) {
      if (isSigned) {
        return MachineWord.MAX
      } else {
        return MachineWord.ZERO
      }
    }
    const result = this.value.shrn(by.value.toNumber())
    if (isSigned) {
      const shiftedOutWidth = 255 - by.value.toNumber()
      const mask = MAX_256.shrn(shiftedOutWidth).shln(shiftedOutWidth)
      result.ior(mask)
    }
    return new MachineWord(result)
  }
}
