import { makePath } from '../../src/fs/Path'
import { spy } from 'sinon'
import { expect } from 'chai'
import { getOptionsWithDefaults } from '../../src/TestChainOptions'
import { loadConfig } from '../../src/config/loader'
import { mockFs } from '../fs/fs.mock'

describe('config loader', () => {
  it('loads JSON config', () => {
    const dir = makePath('/deth/deth.json')
    const customConfig = { chainId: 420 }
    const testFileSystem = mockFs({
      fileExists: spy(() => true),
      requireFile: spy(() => customConfig),
    })

    const config = loadConfig(testFileSystem, dir)

    expect(config).to.be.deep.eq(getOptionsWithDefaults(customConfig))
    expect(testFileSystem.requireFile).to.be.calledWithExactly('/deth/deth.json')
  })

  it('throws on missing config', () => {
    const path = makePath('/deth/deth.json')
    const customConfig = { chainId: 420 }
    const testFileSystem = mockFs({
      requireFile: spy(() => customConfig),
    })

    expect(() => loadConfig(testFileSystem, path)).to.throw()
  })
})
