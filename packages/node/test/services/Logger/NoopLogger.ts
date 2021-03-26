import { DethLogger } from '../../../src/services/logger/DethLogger'

/* eslint-disable @typescript-eslint/no-empty-function */

export class NoopLogger implements DethLogger {
  logTransaction(): void {}
  logEvent(): void {}
  logRevert(): void {}
  logNodeInfo(): void {}
  logNodeListening(): void {}
}
