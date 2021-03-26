import { join, isAbsolute, basename, dirname } from 'path'

import { Opaque } from 'ts-essentials'

export type Path = Opaque<'Path', string>
export function makePath(value: string): Path {
  if (!isAbsolute(value)) {
    throw new TypeError(`Path ${value} is not absolute!`)
  }

  return value as any
}

/**
 * if path is relative use basePath to create absolute one
 * NOTE: if path is already absolute it will just use it
 */
export function relativePathToPath(relativePath: string, basePath: string) {
  if (isAbsolute(relativePath)) {
    return makePath(relativePath)
  }
  return makePath(join(basePath, relativePath))
}

export function getBaseName(path: Path): string {
  return basename(path)
}

export function getDirName(path: Path): Path {
  return makePath(dirname(path))
}
