import { RequestSubmitted } from '../generated/TransferWithSecretRequestDispatcher/TransferWithSecretRequestDispatcher'
import {
  createCoinMovingHistory,
  ensureEndUser,
  ensureToken,
  ensureTransferWithSecret
} from './helpers'

export function handleRequestSubmitted(event: RequestSubmitted): void {
  const transferHistory = ensureTransferWithSecret(
    event.transaction.hash,
    event.transactionLogIndex,
    event.block.timestamp
  )

  const token = ensureToken(event.params.token, event.block.timestamp)

  token.save()

  const from = ensureEndUser(event.params.from, event.block.timestamp)
  const to = ensureEndUser(event.params.to, event.block.timestamp)

  from.save()
  to.save()

  transferHistory.token = token.id
  transferHistory.sender = from.id
  transferHistory.recipient = to.id
  transferHistory.amount = event.params.amount
  transferHistory.metadata = event.params.metadata
  transferHistory.recipientMetadata = event.params.recipientMetadata
  transferHistory.status = 'COMPLETED'

  createCoinMovingHistory(
    event.transaction.hash,
    event.transactionLogIndex,
    event.block.timestamp,
    token.id,
    from.id,
    to.id,
    transferHistory.amount,
    'SECRET',
    transferHistory.metadata
  )

  transferHistory.save()
}
