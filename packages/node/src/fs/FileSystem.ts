import { Path } from './Path'

export interface FileSystem {
  fileExists(path: Path): boolean,
  listDir(path: Path): Path[],
  findFiles(pattern: string, basePath: Path): Path[], // supports glob patterns
  readFile(path: Path): string,
  requireFile(path: Path): any,
}
