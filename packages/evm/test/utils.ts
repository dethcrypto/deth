import { MachineWord } from '../src/MachineWord'

export const negative = (value: string) => MachineWord.ZERO
  .subtract(MachineWord.fromHexString(value))
  .toHexString()
