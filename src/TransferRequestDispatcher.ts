import { Transferred } from '../generated/TransferRequestDispatcher/TransferRequestDispatcher'
import { createCoinMovingHistory, ensureTransferRequest } from './helpers'

export function handleTransferred(event: Transferred): void {
  const transferHistory = ensureTransferRequest(
    event.transaction.hash,
    event.transactionLogIndex,
    event.block.timestamp
  )

  transferHistory.token = event.params.token
  transferHistory.sender = event.params.from
  transferHistory.recipient = event.params.to
  transferHistory.amount = event.params.amount
  transferHistory.metadata = event.params.metadata

  transferHistory.save()

  createCoinMovingHistory(
    event.transaction.hash,
    event.transactionLogIndex,
    event.block.timestamp,
    event.params.token,
    event.params.from,
    event.params.to,
    event.params.amount,
    event.params.metadata,
    'DIRECT'
  )
}
