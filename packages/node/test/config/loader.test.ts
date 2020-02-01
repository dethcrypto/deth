import { makePath } from '../../src/fs/Path'
import { FileSystem } from '../../src/fs/FileSystem'
import { spy } from 'sinon'
import { expect } from 'chai'
import { getOptionsWithDefaults } from '../../src/TestChainOptions'
import { loadConfig } from '../../src/config/loader'

describe('config loader', () => {
  it('loads JSON config', () => {
    const dir = makePath('/deth/deth.json')
    const customConfig = { chainId: 420 }
    const testFileSystem: FileSystem = {
      listDir: spy(() => []),
      fileExists: spy(() => true),
      readFile: spy(() => JSON.stringify(customConfig)),
    }

    const config = loadConfig(testFileSystem, dir)

    expect(config).to.be.deep.eq(getOptionsWithDefaults(customConfig))
    expect(testFileSystem.readFile).to.be.calledWithExactly('/deth/deth.json')
  })

  it('throws on missing config', () => {
    const path = makePath('/deth/deth.json')
    const customConfig = { chainId: 420 }
    const testFileSystem: FileSystem = {
      listDir: spy(() => []),
      fileExists: spy(() => false),
      readFile: spy(() => JSON.stringify(customConfig)),
    }

    expect(() => loadConfig(testFileSystem, path)).to.throw()
  })
})
