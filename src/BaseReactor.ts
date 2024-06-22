import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts'
import {
  Filled
} from '../generated/BaseReactor/BaseReactor'
import { FilledHistory } from '../generated/schema'

export function handleFilled(event: Filled): void {
  const filledHistory = ensureFilled(
    event.transaction.hash,
    event.transactionLogIndex,
    event.block.timestamp
  )

  filledHistory.swapper = event.params.swapper
  filledHistory.inputToken = event.params.inputToken
  filledHistory.inputAmount = event.params.inputAmount

  for (let i = 0; i < event.params.outputTokens.length; i++) {
    filledHistory.outputAmounts.push(event.params.outputTokens[i].amount)
    filledHistory.outputRecipients.push(event.params.outputTokens[i].recipient)
  }

  filledHistory.save()
}


export function ensureFilled(
  txHash: Bytes,
  logIndex: BigInt,
  eventTime: BigInt
): FilledHistory {
  const id = txHash.toString() + '-' + logIndex.toString()

  let filledHistory = FilledHistory.load(id)

  if (filledHistory == null) {
    filledHistory = new FilledHistory(id)

    filledHistory.txHash = txHash
    filledHistory.swapper = Address.zero()
    filledHistory.inputToken = Address.zero()
    filledHistory.inputAmount = BigInt.zero()
    filledHistory.outputAmounts = []
    filledHistory.outputRecipients = []
    filledHistory.createdAt = eventTime
  }

  return filledHistory
}