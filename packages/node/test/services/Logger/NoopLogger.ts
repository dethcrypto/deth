import { DethLogger } from '../../../src/services/logger/DethLogger'

/* eslint @typescript-eslint/no-empty-function: 0 */

export class NoopLogger implements DethLogger {
  logTransaction (): void {}
  logEvent (): void {}
  logRevert (): void {}
  logNodeInfo (): void {}
}
