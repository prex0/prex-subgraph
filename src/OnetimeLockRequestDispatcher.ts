import {
  RecipientUpdated,
  RequestSubmitted,
  RequestCancelled
} from '../generated/OnetimeLockRequestDispatcher/OnetimeLockRequestDispatcher'
import { ensureEndUser, ensureOnetimeLock, ensureToken } from './helpers'

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

  onetimeLock.save()
}

export function handleRecipientUpdated(event: RecipientUpdated): void {
  const onetimeLock = ensureOnetimeLock(event.params.id, event.block.timestamp)

  const recipient = ensureEndUser(event.params.recipient, event.block.timestamp)

  recipient.save()

  onetimeLock.recipient = recipient.id
  onetimeLock.recipientMetadata = event.params.metadata
  onetimeLock.status = 'COMPLETED'

  onetimeLock.save()
}

export function handleRequestCancelled(event: RequestCancelled): void {
  const onetimeLock = ensureOnetimeLock(event.params.id, event.block.timestamp)

  onetimeLock.status = 'CANCELLED'

  onetimeLock.save()
}
