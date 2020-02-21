import { TestProvider } from '../src/TestProvider'
import { TestChain } from '../src/TestChain'
import { TestProviderOptions } from '../src/TestProviderOptions'
import { NoopLogger } from './debugger/Logger/NoopLogger'

const hexDigits = '0123456789abcdef'

const randomHexDigit = () =>
  hexDigits[Math.floor(Math.random() * hexDigits.length)]

export const randomHexString = (length: number) =>
  '0x' + new Array(length).fill(0).map(randomHexDigit).join('')

export const randomHash = () => randomHexString(64)

export async function createTestProvider (chainOrOptions?: TestChain | TestProviderOptions) {
  const provider = new TestProvider(new NoopLogger(), chainOrOptions)
  await provider.init()

  return provider
}
