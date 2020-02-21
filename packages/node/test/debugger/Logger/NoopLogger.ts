import { DethLogger } from '../../../src/debugger/Logger/DethLogger'

/* eslint @typescript-eslint/no-empty-function: 0 */

export class NoopLogger implements DethLogger {
  logTransaction (): void {}
  logEvent (): void {}
  logRevert (): void {}
}
