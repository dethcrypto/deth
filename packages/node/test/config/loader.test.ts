import { makePath } from '../../src/fs/Path'
import { spy } from 'sinon'
import { expect } from 'chai'
import { loadConfig } from '../../src/config/loader'
import { mockFs } from '../fs/fs.mock'
import { getConfigWithDefaults, NodeConfig } from '../../src/config/config'
import { DeepPartial } from 'ts-essentials'

describe('config loader', () => {
  it('loads JSON config', () => {
    const dir = makePath('/deth/deth.json')
    const customConfig: DeepPartial<NodeConfig> = { blockchain: { chainId: 420 } }
    const testFileSystem = mockFs({
      fileExists: spy(() => true),
      requireFile: spy(() => customConfig),
    })

    const config = loadConfig(testFileSystem, dir)

    expect(config).to.be.deep.eq(getConfigWithDefaults(customConfig))
    expect(testFileSystem.requireFile).to.be.calledWithExactly('/deth/deth.json')
  })

  it('throws on missing config', () => {
    const path = makePath('/deth/deth.json')
    const customConfig: DeepPartial<NodeConfig> = { blockchain: { chainId: 420 } }
    const testFileSystem = mockFs({
      requireFile: spy(() => customConfig),
    })

    expect(() => loadConfig(testFileSystem, path)).to.throw()
  })
})
