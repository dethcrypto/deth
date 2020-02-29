import { TestProvider } from './test-chain/TestProvider/TestProvider'
import { TestChain } from '../src/test-chain/TestChain'
import { TestProviderOptions } from './test-chain/TestProvider/TestProviderOptions'

const hexDigits = '0123456789abcdef'

const randomHexDigit = () =>
  hexDigits[Math.floor(Math.random() * hexDigits.length)]

export const randomHexString = (length: number) =>
  '0x' + new Array(length).fill(0).map(randomHexDigit).join('')

export const randomHash = () => randomHexString(64)
