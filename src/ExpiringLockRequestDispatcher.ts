import {
  Submitted,
  Received,
  Deposited
} from '../generated/ExpiringLockRequestDispatcher/ExpiringLockRequestDispatcher'
import {
  ensureEndUser,
  ensureExpiringLock,
  ensureExpiringLockDeposit,
  ensureExpiringLockDistribution,
  ensureToken
} from './helpers'

export function handleSubmitted(event: Submitted): void {
  const expiringLock = ensureExpiringLock(
    event.params.id,
    event.block.timestamp
  )

  const token = ensureToken(event.params.token, event.block.timestamp)

  token.save()

  const sender = ensureEndUser(event.params.sender, event.block.timestamp)

  sender.save()

  expiringLock.token = token.id
  expiringLock.sender = sender.id
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

  const depositor = ensureEndUser(event.params.depositor, event.block.timestamp)

  depositor.save()

  deposit.amount = event.params.amount
  deposit.depositor = depositor.id
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

  const recipient = ensureEndUser(event.params.recipient, event.block.timestamp)

  recipient.save()

  distribution.amount = event.params.amount
  distribution.recipient = recipient.id
  distribution.metadata = event.params.metadata

  distribution.save()
}
