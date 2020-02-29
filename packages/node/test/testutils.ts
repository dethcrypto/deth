const hexDigits = '0123456789abcdef'

const randomHexDigit = () =>
  hexDigits[Math.floor(Math.random() * hexDigits.length)]

export const randomHexString = (length: number) =>
  '0x' + new Array(length).fill(0).map(randomHexDigit).join('')

export const randomHash = () => randomHexString(64)
