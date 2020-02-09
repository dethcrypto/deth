import { ExecutionContext } from '../ExecutionContext'
import { Bytes32 } from '../Bytes32'
import { getContractAddress } from '../getContractAddress'
import { executeCode } from '../executeCode'

export function opCREATE (ctx: ExecutionContext) {
  const value = ctx.stack.pop()
  const memoryOffset = ctx.stack.pop().toUnsignedNumber()
  const memoryBytes = ctx.stack.pop().toUnsignedNumber()

  const gasLeft = ctx.message.gasLimit - ctx.gasUsed
  const gasLimit = allButOne64th(gasLeft)
  const initCode = ctx.memory.getBytes(memoryOffset, memoryBytes)

  const nonce = ctx.state.getNonce(ctx.message.account)
  const balance = ctx.state.getBalance(ctx.message.account)

  const contract = getContractAddress(ctx.message.account, nonce)

  if (balance.lt(value)) {
    ctx.stack.push(Bytes32.ZERO)
    return
  }

  ctx.state.setNonce(ctx.message.account, nonce + 1)
  ctx.state.setBalance(ctx.message.account, balance.sub(value))

  const result = executeCode({
    account: contract,
    callDepth: ctx.message.callDepth + 1,
    sender: ctx.message.account,
    origin: ctx.message.origin,
    gasLimit,
    gasPrice: ctx.message.gasPrice,
    code: initCode,
    data: [],
    enableStateModifications: ctx.message.enableStateModifications,
    value,
  }, ctx.state.clone())

  if (result.type === 'ExecutionSuccess') {
    ctx.stack.push(Bytes32.fromAddress(contract))
    ctx.state = result.state

    ctx.useGas(result.gasUsed)
    ctx.refund(result.gasRefund)
  } else {
    ctx.stack.push(Bytes32.ZERO)
  }
}

function allButOne64th (value: number) {
  return value - Math.floor(value / 64)
}
