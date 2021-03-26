export const memoryGas = (bytes: number) =>
  memoryGasWords(Math.ceil(bytes / 32))

const memoryGasWords = (words: number) =>
  words * 3 + Math.floor((words * words) / 512)
