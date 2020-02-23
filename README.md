<p align="center">
  <img src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/google/223/skull-and-crossbones_2620.png" width="120" alt="deth">
  <h3 align="center">Deth Node</h3>
  <h5 align="center">/ dev nəʊd /</h5>
  <p align="center">Ethereum Node focused on Developer Experience</p>
  <p align="center">
    <img alt="Build status" src="https://circleci.com/gh/ethereum-ts/deth.svg?style=svg">
    <a href="/package.json"><img alt="Software License" src="https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square"></a>
  </p>
</p>

## Features

- RPC support
- state snapshots (`evm_snapshot`), time manipulation (`evm_increaseTime`), mining control (`evm_mine`)
- print out decoded logs and calldata for all transactions (even reverted ones!)
- display revert reasons
- much faster (60%) than ganache

**Note**: current features represent just a gist of what we want to accomplish.

![Demo](https://media.giphy.com/media/fADezF7gMqKszWXaSH/giphy.gif)

## Installation

```
npm install --save-dev deth
```

## Getting started

```sh
deth [config]
```

Sample config (we support only `.js` configs for now):

```js
const BN = require('bn.js')

module.exports = {
  accounts: {
    privateKeys: [
      '0x47be2b1589bb515b76b47c514be96b23cd60ee37e81d63c2ae9c92f7d7667e1a',
      '0x72a4d3589099f14b31725dee59b186419bac41c42d2d02b2c70c1a8af2a2b6bb',
      '0x1ff8271bf14ac9bef0b641cced40dc2a7ebd2e37d8e16d25b4aa1911364219af',
      '0x1444ab10c1d1e8aabb89534218854df60d90bb45f39b55634777461d5a465e2e',
      '0xbff5647520d5e327178330ec0085ab27a58fb26ecb942f770397a940fa5c5d29',
      '0x8db53d08e85593ffb623e89e352bfed4eea350e6cc9812f11eac4de576f3cfda',
      '0x24e467ab36f3cf70767135775ec1f7cc2a8b17363055e548113d85072136f945',
      '0xc3bc1a16a82622f9bddf48f8e754c98092755e2e3782aafdca4ce21a1082747f',
      '0xe54c55b3c5d80d445841afa3141e52592bec8523d8993d8df1811bfc5bf64d59',
      '0x48ee1f88167591357bb6780cbc09bc01e2a93d439e789d44261bf747034164e0'
    ],
    initialBalance: new BN(10000).pow(new BN(18))
  },
  blockchain: {
    chainId: 420
  },
  debugger: {
    abiFilesGlob: '../contracts/**/out/*.abi'
  }
}
```

NOTE: `debugger > abiFilesGlob`.

You can find defaults [here](https://github.com/ethereum-ts/deth/blob/master/packages/node/src/config/config.ts)

## Roadmap

- original source code (sol) awareness (source maps, memory layouts etc.)
- Web interface (simple block explorer)
- real debugger (via webinterface or directly in the IDE)
