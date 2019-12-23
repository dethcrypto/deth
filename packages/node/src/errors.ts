export function transactionNotFound (hash: string) {
  return new Error(`Transaction ${hash} not found.`)
}

export function unsupportedBlockTag (
  operation: string,
  blockTag: string,
  use?: string[],
) {
  let message = `${operation}: Unsupported blockTag "${blockTag}."`
  if (use && use.length > 0) {
    const alternatives = use.map(x => `"${x}"`).join(' or ')
    message += ` Use ${alternatives}.`
  }
  return new Error(message)
}

export function unsupportedOperation (operation: string) {
  return new Error(`${operation}: Unsupported operation.`)
}
