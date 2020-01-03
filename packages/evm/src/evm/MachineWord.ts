import BN from 'bn.js'

const TWO_POW256 = new BN('1' + '0'.repeat(64), 16)
const MAX_256 = new BN('f'.repeat(64), 16)

export class MachineWord {
  private constructor (private value: BN) {
    if (value.isNeg() || value.gt(MAX_256)) {
      throw new TypeError('Invalid MachineWord initialized')
    }
  }

  static ZERO = new MachineWord(new BN(0))
  static ONE = new MachineWord(new BN(1))
  static MAX = new MachineWord(MAX_256)

  static fromBoolean (value: boolean) {
    return value ? MachineWord.ONE : MachineWord.ZERO
  }

  static fromHexString (value: string) {
    return new MachineWord(new BN(value, 16))
  }

  toHexString () {
    return this.value.toString(16, 64)
  }

  private get signed () {
    return this.value.fromTwos(256)
  }

  /**
   * Returns the result of adding the argument to this machine word
   */
  add (other: MachineWord) {
    const result = this.value
      .add(other.value)
      .mod(TWO_POW256)
    return new MachineWord(result)
  }

  /**
   * Returns the result of multiplying this machine word by the argument
   */
  mul (other: MachineWord) {
    const result = this.value
      .mul(other.value)
      .mod(TWO_POW256)
    return new MachineWord(result)
  }

  /**
   * Returns the result of subtracting the argument from this machine word
   */
  sub (other: MachineWord) {
    const result = this.value
      .sub(other.value)
      .toTwos(256)
    return new MachineWord(result)
  }

  /**
   * Returns the result of dividing this machine word by the argument
   */
  div (other: MachineWord) {
    if (other.value.isZero()) {
      return MachineWord.ZERO
    }
    const result = this.value
      .div(other.value)
    return new MachineWord(result)
  }

  /**
   * Returns the result of dividing this machine word by the argument.
   * Treats the contents as two's complement signed integers
   */
  sdiv (other: MachineWord) {
    if (other.value.isZero()) {
      return MachineWord.ZERO
    }
    const result = this.signed
      .div(other.signed)
      .toTwos(256)
    return new MachineWord(result)
  }

  /**
   * Returns the remainder after dividing this machine word by the argument
   */
  mod (other: MachineWord) {
    if (other.value.isZero()) {
      return MachineWord.ZERO
    }
    const result = this.value
      .mod(other.value)
    return new MachineWord(result)
  }

  /**
   * Returns the remainder after dividing this machine word by the argument.
   * Treats the contents as two's complement signed integers
   */
  smod (other: MachineWord) {
    if (other.value.isZero()) {
      return MachineWord.ZERO
    }

    const intermediate = this.signed.abs().mod(other.signed.abs())
    const result = this.signed.isNeg()
      ? intermediate.ineg().toTwos(256)
      : intermediate
    return new MachineWord(result)
  }

  /**
   * Returns this machine word raised to the power of the argument
   */
  exp (power: MachineWord) {
    if (power.value.isZero()) {
      return MachineWord.ONE
    }
    if (this.value.isZero()) {
      return MachineWord.ZERO
    }
    const redBase = this.value.toRed(BN.red(TWO_POW256))
    const result = redBase.redPow(power.value)
    return new MachineWord(result)
  }

  /**
   * Returns the this machine word converted to a 256 bit two's complement
   * integer, by extending the sign of it's n-byte fragment, where n is
   * specified by the argument
   */
  signextend (bytes: MachineWord) {
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

  /**
   * Returns ONE if this machine word is lesser than the argument. Otherwise
   * returns ZERO
   */
  lt (other: MachineWord) {
    const result = this.value.lt(other.value)
    return MachineWord.fromBoolean(result)
  }

  /**
   * Returns ONE if this machine word is greater than the argument. Otherwise
   * returns ZERO
   */
  gt (other: MachineWord) {
    const result = this.value.gt(other.value)
    return MachineWord.fromBoolean(result)
  }

  /**
   * Returns ONE if this machine word is lesser than the argument. Otherwise
   * returns ZERO. Treats the contents as two's complement signed integers
   */
  slt (other: MachineWord) {
    const result = this.signed.lt(other.signed)
    return MachineWord.fromBoolean(result)
  }

  /**
   * Returns ONE if this machine word is greater than the argument. Otherwise
   * returns ZERO. Treats the contents as two's complement signed integers
   */
  sgt (other: MachineWord) {
    const result = this.signed.gt(other.signed)
    return MachineWord.fromBoolean(result)
  }

  /**
   * Returns ONE if this machine word is equal to the argument. Otherwise
   * returns ZERO
   */
  eq (other: MachineWord) {
    const result = this.value.eq(other.value)
    return MachineWord.fromBoolean(result)
  }

  /**
   * Returns ONE if this machine word is equal to ZERO. Otherwise
   * returns ZERO
   */
  iszero () {
    const result = this.value.isZero()
    return MachineWord.fromBoolean(result)
  }

  /**
   * Returns the result of the binary AND operation on this machine word and
   * the argument
   */
  and (other: MachineWord) {
    const result = this.value.and(other.value)
    return new MachineWord(result)
  }

  /**
   * Returns the result of the binary OR operation on this machine word and
   * the argument
   */
  or (other: MachineWord) {
    const result = this.value.or(other.value)
    return new MachineWord(result)
  }

  /**
   * Returns the result of the binary XOR operation on this machine word and
   * the argument
   */
  xor (other: MachineWord) {
    const result = this.value.xor(other.value)
    return new MachineWord(result)
  }

  /**
   * Returns the result of the binary NOT operation on this machine word
   */
  not () {
    const result = this.value.notn(256)
    return new MachineWord(result)
  }

  /**
   * Returns the n-th byte of this machine word, or ZERO if n >= 32, where n is
   * specified by the argument
   */
  byte (position: MachineWord) {
    if (position.value.gten(32)) {
      return MachineWord.ZERO
    }
    // for some reason the actual type of result is number!
    const result = this.value
      .shrn((31 - position.value.toNumber()) * 8)
      .andln(0xff)
    return new MachineWord(new BN(result))
  }

  /**
   * Returns this machine word shifted left by n bits, where n is specified by
   * the argument
   */
  shl (by: MachineWord) {
    if (by.value.gten(256)) {
      return MachineWord.ZERO
    }
    const result = this.value.shln(by.value.toNumber()).iand(MAX_256)
    return new MachineWord(result)
  }

  /**
   * Returns this machine word logically shifted right by n bits, where n is
   * specified by the argument
   */
  shr (by: MachineWord) {
    if (by.value.gten(256)) {
      return MachineWord.ZERO
    }
    const result = this.value.shrn(by.value.toNumber())
    return new MachineWord(result)
  }

  /**
   * Returns this machine word arithmetically shifted right by n bits, where n
   * is specified by the argument
   */
  sar (by: MachineWord) {
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
