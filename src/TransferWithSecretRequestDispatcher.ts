import {
  RequestSubmitted,
} from '../generated/TransferWithSecretRequestDispatcher/TransferWithSecretRequestDispatcher'
import { createCoinMovingHistory, ensureTransferWithSecret } from './helpers'

export function handleRequestSubmitted(event: RequestSubmitted): void {
  const transferHistory = ensureTransferWithSecret(
    event.transaction.hash,
    event.transactionLogIndex,
    event.block.timestamp,
  )

  transferHistory.token = event.params.token
  transferHistory.sender = event.params.from
  transferHistory.recipient = event.params.to
  transferHistory.amount = event.params.amount
  transferHistory.metadata = event.params.metadata
  transferHistory.recipientMetadata = event.params.recipientMetadata
  transferHistory.status = 'COMPLETED'

  createCoinMovingHistory(
    event.transaction.hash,
    event.transactionLogIndex,
    event.block.timestamp,
    event.params.token,
    event.params.from,
    event.params.to,
    transferHistory.amount,
    transferHistory.metadata,
    'SECRET'
  )

  transferHistory.save()
}
