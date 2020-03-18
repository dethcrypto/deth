import { ExecutionContext } from '../ExecutionContext'
import { Bytes32 } from '../Bytes32'
import { getContractAddress } from '../getContractAddress'
import { executeCode } from '../executeCode'
import { Bytes } from '../Bytes'
import { IllegalStateModification, OutOfGas } from '../errors'
import { GasCost } from './gasCosts'
import { State } from '../State'
import { Message } from '../Message'
import { ExecutionResult } from '../ExecutionResult'

const CODE_SIZE_LIMIT = 24_576

export function opCREATE (ctx: ExecutionContext) {
  if (!ctx.message.enableStateModifications) {
    throw new IllegalStateModification('CREATE')
  }

  ctx.useGas(GasCost.CREATE)

  const value = ctx.stack.pop()
  const memoryOffset = ctx.stack.pop().toUnsignedNumber()
  const memoryBytes = ctx.stack.pop().toUnsignedNumber()

  // We need to calculate this before return because memory access uses gas
  const initCode = ctx.memory.getBytes(memoryOffset, memoryBytes)

  const balance = ctx.state.getBalance(ctx.message.account)

  ctx.previousCallReturnValue = Bytes.EMPTY

  if (balance.lt(value) || ctx.message.callDepth >= 1024) {
    ctx.stack.push(Bytes32.ZERO)
    return
  }

  const nonce = ctx.state.getNonce(ctx.message.account)
  ctx.state.setNonce(ctx.message.account, nonce + 1)
  const contract = getContractAddress(ctx.message.account, nonce)
  const gasLimit = allButOne64th(ctx.message.gasLimit - ctx.gasUsed)

  const result = executeContractCreation({
    account: contract,
    callDepth: ctx.message.callDepth + 1,
    sender: ctx.message.account,
    origin: ctx.message.origin,
    gasLimit,
    gasPrice: ctx.message.gasPrice,
    code: initCode,
    data: Bytes.EMPTY,
    enableStateModifications: true,
    value,
  }, ctx.state)

  if (result.type === 'ExecutionSuccess') {
    ctx.stack.push(Bytes32.fromAddress(contract))
    ctx.state = result.state
    ctx.useGas(result.gasUsed)
    ctx.refund(result.gasRefund)
    // TODO: only do this if contract didn't SELFDESCTRUCT
    ctx.state.setCode(contract, result.returnValue)
  } else if (result.type === 'ExecutionRevert') {
    ctx.stack.push(Bytes32.ZERO)
    ctx.useGas(result.gasUsed)
  } else if (result.type === 'ExecutionError') {
    ctx.stack.push(Bytes32.ZERO)
    ctx.useGas(gasLimit)
  }
}

function allButOne64th (value: number) {
  return value - Math.floor(value / 64)
}

function executeContractCreation (message: Message, state: State): ExecutionResult {
  const newState = state.clone()
  newState.setBalance(
    message.sender,
    newState.getBalance(message.sender).sub(message.value),
  )
  newState.setNonce(message.account, 1)
  newState.setBalance(
    message.account,
    newState.getBalance(message.account).add(message.value),
  )

  const result = executeCode(message, newState)

  if (result.type === 'ExecutionSuccess') {
    const finalCreationCost = GasCost.CODEDEPOSIT * result.returnValue.length
    const totalGas = result.gasUsed + finalCreationCost
    if (
      totalGas > message.gasLimit ||
      result.returnValue.length > CODE_SIZE_LIMIT
    ) {
      return {
        type: 'ExecutionError',
        error: new OutOfGas(),
      }
    }
  }

  return result
}
