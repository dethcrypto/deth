import BN from 'bn.js'
import { Hardfork } from '../test-chain/model'
import { Path, makePath } from '../fs/Path'
import { DeepPartial } from 'ts-essentials'
import { merge } from 'lodash'

export type NodeConfig = {
  accounts: {
    privateKeys: string[],
    initialBalance: BN,
  },
  blockchain: {
    hardfork: Hardfork,
    blockGasLimit: BN,
    defaultGasPrice: BN,
    coinbaseAddress: string,
    chainId: number,
    chainName: string,
    clockSkew: number,
    autoMining: boolean,
    skipNonceCheck: boolean,
    skipBalanceCheck: boolean,
  },
  debugger: {
    abiFilesGlob?: string,
  },
  cwd: Path, // config's directory if it was provided
}

export const DEFAULT_NODE_CONFIG: NodeConfig = {
  accounts: {
    privateKeys: [
      // mnemonic: sunset setup guard source about taste volume clown method shield height butter
      '0x7045641ca116966a2bd5cd118bc001873ef025e5be60de68237e036fb5be1a58',
      '0x549eb2b0ccc7470fa3055fe08174485cd6f08cbf624cc1763721c598dfc517f8',
      '0x055d98781b373754affd58588759d3232c79512b454a02c2c680ccf90c8f735c',
      '0x5eb5c55ca38bf026083d7f6ac0c02f7315394f2564e5277ca48a5b1ebd182e54',
      '0x5db7ebd2ec315268b67966a2f67263b0299e584190f9ffae11f70ef24fbf27c7',
      '0xa2f4c1f521723baa3512df7fcfa4acc04cf9e4357f89413ca425047cc5832a73',
      '0x8af7a8dae4d9a1f5bea17f028cfa4fd435170ebe290c80c5b94de9cc77b26a85',
      '0xca07932c66f6600fc326e6c3845743a5e3b1c224f4b0d43d48004490de6d9a4d',
      '0x12a4fd3f2d9ad98ede42228b5a885c8adc95daf8c36eadb9aafe40cb3bbeb02e',
      '0x7492f9da2b92d144da51bdfda426645f3af0f7388b2bd47ae9bf91cae111519a',
    ],
    initialBalance: new BN(10).pow(new BN(20)),
  },
  blockchain: {
    hardfork: 'petersburg',
    blockGasLimit: new BN(10_000_000),
    defaultGasPrice: new BN(1_000_000_000), // one gwei
    coinbaseAddress: '0xdEadBeEf00000000DeADBeef00000000dEAdBeeF',
    chainId: 1337,
    chainName: 'deth/0.0.1', // todo real version here
    autoMining: true,
    clockSkew: 0,
    skipNonceCheck: true,
    skipBalanceCheck: false,
  },
  debugger: {
    abiFilesGlob: undefined,
  },
  cwd: makePath(process.cwd()),
}

export function getConfigWithDefaults (options: DeepPartial<NodeConfig> = {}): NodeConfig {
  return merge({}, DEFAULT_NODE_CONFIG, options)
}
