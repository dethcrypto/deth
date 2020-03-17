import BN from 'bn.js'
import { Bytes } from './Bytes'

const TWO_POW256 = new BN('1' + '0'.repeat(64), 16)
const MAX_256 = new BN('f'.repeat(64), 16)

export class Bytes32 {
  private constructor (private value: BN) {
    if (value.isNeg() || value.gt(MAX_256)) {
      throw new TypeError('Invalid Bytes32 initialized')
    }
  }

  static ZERO = new Bytes32(new BN(0))
  static ONE = new Bytes32(new BN(1))
  static MAX = new Bytes32(MAX_256)

  static fromBoolean (value: boolean) {
    return value ? Bytes32.ONE : Bytes32.ZERO
  }

  static fromNumber (value: number) {
    return new Bytes32(new BN(value).toTwos(256))
  }

  static fromHex (value: string) {
    return new Bytes32(new BN(value, 16))
  }

  static fromBytes (value: Bytes) {
    return Bytes32.fromHex(value.toHex())
  }

  toUnsignedNumber () {
    try {
      return this.value.toNumber()
    } catch {
      return Infinity
    }
  }

  toHex () {
    return this.value.toString(16, 64)
  }

  toBytes () {
    return Bytes.fromString(this.toHex())
  }

  private get signed () {
    return this.value.fromTwos(256)
  }

  /**
   * Returns the result of adding the argument to this machine word
   */
  add (other: Bytes32) {
    const result = this.value
      .add(other.value)
      .mod(TWO_POW256)
    return new Bytes32(result)
  }

  /**
   * Returns the result of multiplying this machine word by the argument
   */
  mul (other: Bytes32) {
    const result = this.value
      .mul(other.value)
      .mod(TWO_POW256)
    return new Bytes32(result)
  }

  /**
   * Returns the result of subtracting the argument from this machine word
   */
  sub (other: Bytes32) {
    const result = this.value
      .sub(other.value)
      .toTwos(256)
    return new Bytes32(result)
  }

  /**
   * Returns the result of dividing this machine word by the argument
   */
  div (other: Bytes32) {
    if (other.value.isZero()) {
      return Bytes32.ZERO
    }
    const result = this.value
      .div(other.value)
    return new Bytes32(result)
  }

  /**
   * Returns the result of dividing this machine word by the argument.
   * Treats the contents as two's complement signed integers
   */
  sdiv (other: Bytes32) {
    if (other.value.isZero()) {
      return Bytes32.ZERO
    }
    const result = this.signed
      .div(other.signed)
      .toTwos(256)
    return new Bytes32(result)
  }

  /**
   * Returns the remainder after dividing this machine word by the argument
   */
  mod (other: Bytes32) {
    if (other.value.isZero()) {
      return Bytes32.ZERO
    }
    const result = this.value
      .mod(other.value)
    return new Bytes32(result)
  }

  /**
   * Returns the remainder after dividing this machine word by the argument.
   * Treats the contents as two's complement signed integers
   */
  smod (other: Bytes32) {
    if (other.value.isZero()) {
      return Bytes32.ZERO
    }

    const intermediate = this.signed.abs().mod(other.signed.abs())
    const result = this.signed.isNeg()
      ? intermediate.ineg().toTwos(256)
      : intermediate
    return new Bytes32(result)
  }

  /**
   * Returns this machine word raised to the power of the argument
   */
  exp (power: Bytes32) {
    if (power.value.isZero()) {
      return Bytes32.ONE
    }
    if (this.value.isZero()) {
      return Bytes32.ZERO
    }
    const redBase = this.value.toRed(BN.red(TWO_POW256))
    const result = redBase.redPow(power.value)
    return new Bytes32(result)
  }

  /**
   * Returns the this machine word converted to a 256 bit two's complement
   * integer, by extending the sign of it's n-byte fragment, where n is
   * specified by the argument
   */
  signextend (bytes: Bytes32) {
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
    return new Bytes32(result)
  }

  /**
   * Returns `true` if this machine word is lesser than the argument. Otherwise
   * returns `false`
   */
  lt (other: Bytes32) {
    return this.value.lt(other.value)
  }

  /**
   * Returns `true` if this machine word is greater than the argument. Otherwise
   * returns `false`
   */
  gt (other: Bytes32) {
    return this.value.gt(other.value)
  }

  /**
   * Returns `true` if this machine word is lesser than the argument. Otherwise
   * returns `false`. Treats the contents as two's complement signed integers
   */
  slt (other: Bytes32) {
    return this.signed.lt(other.signed)
  }

  /**
   * Returns `true` if this machine word is greater than the argument. Otherwise
   * returns `false`. Treats the contents as two's complement signed integers
   */
  sgt (other: Bytes32) {
    return this.signed.gt(other.signed)
  }

  /**
   * Returns `true` if this machine word is equal to the argument. Otherwise
   * returns `false`
   */
  eq (other: Bytes32) {
    return this.value.eq(other.value)
  }

  /**
   * Returns `true` if this machine word is equal to ZERO. Otherwise
   * returns `false`
   */
  iszero () {
    return this.value.isZero()
  }

  /**
   * Returns the result of the binary AND operation on this machine word and
   * the argument
   */
  and (other: Bytes32) {
    const result = this.value.and(other.value)
    return new Bytes32(result)
  }

  /**
   * Returns the result of the binary OR operation on this machine word and
   * the argument
   */
  or (other: Bytes32) {
    const result = this.value.or(other.value)
    return new Bytes32(result)
  }

  /**
   * Returns the result of the binary XOR operation on this machine word and
   * the argument
   */
  xor (other: Bytes32) {
    const result = this.value.xor(other.value)
    return new Bytes32(result)
  }

  /**
   * Returns the result of the binary NOT operation on this machine word
   */
  not () {
    const result = this.value.notn(256)
    return new Bytes32(result)
  }

  /**
   * Returns the n-th byte of this machine word, or ZERO if n >= 32, where n is
   * specified by the argument
   */
  byte (position: Bytes32) {
    if (position.value.gten(32)) {
      return Bytes32.ZERO
    }
    // for some reason the actual type of result is number!
    const result = this.value
      .shrn((31 - position.value.toNumber()) * 8)
      .andln(0xff)
    return new Bytes32(new BN(result))
  }

  /**
   * Returns this machine word shifted left by n bits, where n is specified by
   * the argument
   */
  shl (by: Bytes32) {
    if (by.value.gten(256)) {
      return Bytes32.ZERO
    }
    const result = this.value.shln(by.value.toNumber()).iand(MAX_256)
    return new Bytes32(result)
  }

  /**
   * Returns this machine word logically shifted right by n bits, where n is
   * specified by the argument
   */
  shr (by: Bytes32) {
    if (by.value.gten(256)) {
      return Bytes32.ZERO
    }
    const result = this.value.shrn(by.value.toNumber())
    return new Bytes32(result)
  }

  /**
   * Returns this machine word arithmetically shifted right by n bits, where n
   * is specified by the argument
   */
  sar (by: Bytes32) {
    const isSigned = this.value.testn(255)
    if (by.value.gten(256)) {
      if (isSigned) {
        return Bytes32.MAX
      } else {
        return Bytes32.ZERO
      }
    }
    const result = this.value.shrn(by.value.toNumber())
    if (isSigned) {
      const shiftedOutWidth = 255 - by.value.toNumber()
      const mask = MAX_256.shrn(shiftedOutWidth).shln(shiftedOutWidth)
      result.ior(mask)
    }
    return new Bytes32(result)
  }
}
