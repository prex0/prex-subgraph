import {
  RequestSubmitted,
  RequestCompleted
} from '../generated/TransferWithSecretRequestDispatcher/TransferWithSecretRequestDispatcher'
import { ensureTransferWithSecret } from './helpers'

export function handleRequestSubmitted(event: RequestSubmitted): void {
  const transferHistory = ensureTransferWithSecret(
    event.params.id,
    event.block.timestamp,
    event.transaction.hash
  )

  transferHistory.token = event.params.token
  transferHistory.sender = event.params.sender
  transferHistory.recipient = event.params.recipient
  transferHistory.amount = event.params.amount
  transferHistory.metadata = event.params.metadata
  transferHistory.status = 'LIVE'

  transferHistory.save()
}

export function handleRequestCompleted(event: RequestCompleted): void {
  const transferHistory = ensureTransferWithSecret(
    event.params.id,
    event.block.timestamp,
    event.transaction.hash
  )

  transferHistory.status = 'COMPLETED'
}
