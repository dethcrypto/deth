import * as fs from 'fs'
import * as glob from 'glob'

import { FileSystem } from './FileSystem'
import { Path, makePath } from './Path'

export class RealFileSystem implements FileSystem {
  fileExists(path: Path): boolean {
    return fs.existsSync(path)
  }

  findFiles(pattern: string, basePath: Path): Path[] {
    const paths = glob.sync(pattern, { cwd: basePath, absolute: true })
    return paths.map(makePath)
  }

  listDir(path: Path): Path[] {
    return fs.readdirSync(path).map(makePath)
  }

  readFile(path: Path): string {
    return fs.readFileSync(path, 'utf8')
  }

  requireFile(path: Path): string {
    return require(path)
  }
}
