import {
  RequestCompleted,
  RequestSubmitted,
  RequestCancelled
} from '../generated/OnetimeLockRequestDispatcherV2/OnetimeLockRequestDispatcher'
import {
  createCoinMovingHistory,
  ensureEndUser,
  ensureOnetimeLock,
  ensureToken,
  updateTokenHolderParams
} from './helpers'

export function handleRequestSubmitted(event: RequestSubmitted): void {
  const onetimeLock = ensureOnetimeLock(event.params.id, event.block.timestamp)

  const token = ensureToken(event.params.token, event.block.timestamp)

  token.save()

  const sender = ensureEndUser(event.params.sender, event.block.timestamp)

  sender.save()

  onetimeLock.token = token.id
  onetimeLock.sender = sender.id
  onetimeLock.amount = event.params.amount
  onetimeLock.metadata = event.params.metadata
  onetimeLock.txHash = event.transaction.hash
  onetimeLock.expiry = event.params.expiry

  onetimeLock.save()
}

export function handleRequestCompleted(event: RequestCompleted): void {
  const onetimeLock = ensureOnetimeLock(event.params.id, event.block.timestamp)

  const recipient = ensureEndUser(event.params.recipient, event.block.timestamp)

  recipient.save()

  onetimeLock.recipient = recipient.id
  onetimeLock.recipientMetadata = event.params.metadata
  onetimeLock.recipientTxHash = event.transaction.hash
  onetimeLock.status = 'COMPLETED'

  onetimeLock.save()

  createCoinMovingHistory(
    event.transaction.hash,
    event.transactionLogIndex,
    event.block.timestamp,
    onetimeLock.token,
    onetimeLock.sender,
    recipient.id,
    onetimeLock.amount,
    'ONETIME',
    event.params.metadata,
    null,
    null,
    null
  )

  updateTokenHolderParams(
    onetimeLock.token,
    onetimeLock.sender,
    recipient.id,
    onetimeLock.amount,
    event.block.timestamp
  )
}

export function handleRequestCancelled(event: RequestCancelled): void {
  const onetimeLock = ensureOnetimeLock(event.params.id, event.block.timestamp)

  onetimeLock.status = 'CANCELLED'

  onetimeLock.save()
}
