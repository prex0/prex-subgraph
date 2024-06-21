import { Submitted, Received } from '../generated/ExpiringLockRequestDispatcher/ExpiringLockRequestDispatcher'
import { ensureExpiringLock, ensureTransferHistory } from './helpers'

export function handleSubmitted(event: Submitted): void {
  const expiringLock = ensureExpiringLock(
    event.params.id,
    event.block.timestamp
  )

  expiringLock.token = event.params.token
  expiringLock.sender = event.params.sender
  expiringLock.amount = event.params.amount

  expiringLock.save()
}

export function handleReceived(event: Received): void {
  const expiringLock = ensureExpiringLock(
    event.params.id,
    event.block.timestamp
  )

  const transferHistory = ensureTransferHistory(
    event.transaction.hash,
    event.transactionLogIndex,
    event.block.timestamp
  )

  transferHistory.token = expiringLock.token
  transferHistory.sender = expiringLock.sender
  transferHistory.recipient = event.params.recipient
  transferHistory.amount = expiringLock.amount

  transferHistory.save()
}