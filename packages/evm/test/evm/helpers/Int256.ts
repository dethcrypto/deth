import { Bytes32 } from '../../../src/evm/Bytes32'

const HEX_REGEX = /^0x[\da-f]*$/

export const Int256 = {
  FALSE: '0'.repeat(64),
  TRUE: '1'.padStart(64, '0'),
  MAX_UNSIGNED: 'f'.repeat(64),
  MAX_SIGNED: '7' + 'f'.repeat(63),
  MIN_SIGNED: '8' + '0'.repeat(63),
  of (value: number | string) {
    if (typeof value === 'string') {
      if (!HEX_REGEX.test(value)) {
        throw new TypeError('Invalid Int256')
      }
      return value.substring(2).padStart(64, '0')
    } else {
      if (!Number.isSafeInteger(value)) {
        throw new TypeError('Invalid Int256')
      }
      return value >= 0
        ? value.toString(16).padStart(64, '0')
        : negative((-value).toString(16))
    }
  },
}

function negative (value: string) {
  return Bytes32.ZERO
    .sub(Bytes32.fromHex(value))
    .toHex()
}
