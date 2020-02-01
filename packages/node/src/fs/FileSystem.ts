import { Path } from './Path'

export interface FileSystem {
  fileExists(path: Path): boolean,
  listDir(path: Path): Path[],
  readFile(path: Path): string,
}
