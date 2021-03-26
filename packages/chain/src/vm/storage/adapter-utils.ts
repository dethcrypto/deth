import { callbackify } from 'util'

export const callbackifySync = (fn: Function): Function =>
  callbackify(async (...args) => fn(...args))
