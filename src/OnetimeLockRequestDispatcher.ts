import { RecipientUpdated, RequestSubmitted } from '../generated/OnetimeLockRequestDispatcher/OnetimeLockRequestDispatcher'
import { ensureOnetimeLock, ensureTransferHistory } from './helpers'

export function handleRequestSubmitted(event: RequestSubmitted): void {
  const onetimeLock = ensureOnetimeLock(
    event.params.id,
    event.block.timestamp
  )

  onetimeLock.token = event.params.token
  onetimeLock.sender = event.params.sender
  onetimeLock.amount = event.params.amount
  onetimeLock.metadata = event.params.metadata

  onetimeLock.save()
}

export function handleRecipientUpdated(event: RecipientUpdated): void {
  const onetimeLock = ensureOnetimeLock(
    event.params.id,
    event.block.timestamp
  )

  const transferHistory = ensureTransferHistory(
    event.transaction.hash,
    event.block.timestamp
  )

  transferHistory.token = onetimeLock.token
  transferHistory.sender = onetimeLock.sender
  transferHistory.recipient = event.params.recipient
  transferHistory.amount = onetimeLock.amount
  transferHistory.metadata = onetimeLock.metadata

  transferHistory.save()
}