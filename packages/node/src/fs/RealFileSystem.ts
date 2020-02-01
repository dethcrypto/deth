import * as fs from 'fs'

import { FileSystem } from './FileSystem'
import { Path, makePath } from './Path'

export class RealFileSystem implements FileSystem {
  fileExists (path: Path): boolean {
    return fs.existsSync(path)
  }

  listDir (path: Path): Path[] {
    return fs.readdirSync(path).map(makePath)
  }

  readFile (path: Path): string {
    return fs.readFileSync(path, 'utf8')
  }
}
