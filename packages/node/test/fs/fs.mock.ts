import { FileSystem } from '../../src/fs/FileSystem'
import { spy, SinonSpy } from 'sinon'

type Spied<T> = {
  [P in keyof T]: T[P] extends (...args: any) => any ? SinonSpy<any, ReturnType<T[P]>> : T[P]
}

export const mockFs = (fs?: Partial<Spied<FileSystem>>): Spied<FileSystem> => {
  return {
    listDir: spy(() => [] as any),
    findFiles: spy(() => [] as any),
    fileExists: spy(() => false),
    readFile: spy(() => ''),
    requireFile: spy(() => ''),
    ...fs,
  }
}
