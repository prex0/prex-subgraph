import {
  Submitted,
  Received,
  Deposited
} from '../generated/ExpiringLockRequestDispatcher/ExpiringLockRequestDispatcher'
import {
  ensureExpiringLock,
  ensureExpiringLockDeposit,
  ensureExpiringLockDistribution
} from './helpers'

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

export function handleDeposited(event: Deposited): void {
  const deposit = ensureExpiringLockDeposit(
    event.transaction.hash,
    event.transactionLogIndex,
    event.params.id,
    event.block.timestamp
  )

  deposit.amount = event.params.amount
  deposit.depositor = event.params.depositor
  deposit.metadata = event.params.metadata

  deposit.save()
}

export function handleReceived(event: Received): void {
  const distribution = ensureExpiringLockDistribution(
    event.transaction.hash,
    event.transactionLogIndex,
    event.params.id,
    event.block.timestamp
  )

  distribution.amount = event.params.amount
  distribution.recipient = event.params.recipient
  distribution.metadata = event.params.metadata

  distribution.save()
}
