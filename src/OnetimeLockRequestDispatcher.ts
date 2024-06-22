import {
  RecipientUpdated,
  RequestSubmitted,
  RequestCancelled
} from '../generated/OnetimeLockRequestDispatcher/OnetimeLockRequestDispatcher'
import { ensureOnetimeLock } from './helpers'

export function handleRequestSubmitted(event: RequestSubmitted): void {
  const onetimeLock = ensureOnetimeLock(event.params.id, event.block.timestamp)

  onetimeLock.token = event.params.token
  onetimeLock.sender = event.params.sender
  onetimeLock.amount = event.params.amount
  onetimeLock.metadata = event.params.metadata

  onetimeLock.save()
}

export function handleRecipientUpdated(event: RecipientUpdated): void {
  const onetimeLock = ensureOnetimeLock(event.params.id, event.block.timestamp)

  onetimeLock.recipient = event.params.recipient
  onetimeLock.recipientMetadata = event.params.metadata
  onetimeLock.status = 'COMPLETED'

  onetimeLock.save()
}

export function RequestCancelled(event: RequestCancelled): void {
  const onetimeLock = ensureOnetimeLock(event.params.id, event.block.timestamp)

  onetimeLock.status = 'CANCELLED'

  onetimeLock.save()
}
