import { BigInt, Bytes } from '@graphprotocol/graph-ts'
import { OrderFilled } from '../generated/SwapExecutorV1/SwapExecutorV1'
import { OrderFilledHistory, OrderFilledHistoryOutput } from '../generated/schema'
import { ensureEndUser, ensureToken } from './helpers'

export function handleOrderFilled(event: OrderFilled): void {
  const filledHistory = ensureOrderFilledHistory(
    event.params.orderHash,
    event.block.timestamp,
    event.transaction.hash
  )

  const token = ensureToken(event.params.token, event.block.timestamp)
  const swapper = ensureEndUser(event.params.swapper, event.block.timestamp)

  filledHistory.swapper = swapper.id
  filledHistory.token = token.id
  filledHistory.amount = event.params.amount
  filledHistory.reactor = event.params.reactor

  for (let i = 0; i < event.params.outputs.length; i++) {
    const outputParams = event.params.outputs[i]
    const output = ensureOrderFilledHistoryOutput(
      event.params.orderHash,
      i
    )

    const token = ensureToken(outputParams.token, event.block.timestamp)
    const swapper = ensureEndUser(outputParams.recipient, event.block.timestamp)

    output.parent = filledHistory.id
    output.token = token.id
    output.amount = outputParams.amount
    output.recipient = swapper.id

    output.save()
  }

  filledHistory.save()
}

export function ensureOrderFilledHistory(
  orderHash: Bytes,
  eventTime: BigInt,
  txHash: Bytes
): OrderFilledHistory {
  const id = orderHash.toHex()

  let filledHistory = OrderFilledHistory.load(id)

  if (filledHistory == null) {
    filledHistory = new OrderFilledHistory(id)

    filledHistory.txHash = txHash
    filledHistory.createdAt = eventTime
  }

  return filledHistory
}

export function ensureOrderFilledHistoryOutput(
  orderHash: Bytes,
  outputIndex: number  
): OrderFilledHistoryOutput {
  const id = orderHash.toHex() + '-' + outputIndex.toString()

  let output = OrderFilledHistoryOutput.load(id)

  if (output == null) {
    output = new OrderFilledHistoryOutput(id)

  }

  return output
}
