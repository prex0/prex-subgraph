import { BigInt, Bytes } from '@graphprotocol/graph-ts'
import { OrderFilled } from '../generated/SwapExecutorV1/SwapExecutorV1'
import { SwapV1History, OrderFilledHistoryOutput } from '../generated/schema'
import { ensureEndUser, ensureToken } from './helpers'

export function handleOrderFilled(event: OrderFilled): void {
  const swapV1History = ensureOrderFilledHistory(
    event.params.orderHash,
    event.block.timestamp,
    event.transaction.hash
  )

  const token = ensureToken(event.params.token, event.block.timestamp)
  const swapper = ensureEndUser(event.params.swapper, event.block.timestamp)

  token.save()
  swapper.save()

  swapV1History.swapper = swapper.id
  swapV1History.token = token.id
  swapV1History.amount = event.params.amount
  swapV1History.reactor = event.params.reactor

  for (let i = 0; i < event.params.outputs.length; i++) {
    const outputParams = event.params.outputs[i]
    const output = ensureOrderFilledHistoryOutput(event.params.orderHash, i)

    const outputToken = ensureToken(outputParams.token, event.block.timestamp)
    const recipient = ensureEndUser(
      outputParams.recipient,
      event.block.timestamp
    )

    output.parent = swapV1History.id
    output.token = outputToken.id
    output.amount = outputParams.amount
    output.recipient = recipient.id

    outputToken.save()
    recipient.save()
    output.save()
  }

  swapV1History.save()
}

export function ensureOrderFilledHistory(
  orderHash: Bytes,
  eventTime: BigInt,
  txHash: Bytes
): SwapV1History {
  const id = orderHash.toHex()

  let swapV1History = SwapV1History.load(id)

  if (swapV1History == null) {
    swapV1History = new SwapV1History(id)

    swapV1History.txHash = txHash
    swapV1History.createdAt = eventTime
  }

  return swapV1History
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
