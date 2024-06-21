import { RequestSubmitted } from '../generated/TransferWithSecretRequestDispatcher/TransferWithSecretRequestDispatcher'
import { ensureTransferHistory } from './helpers'

export function handleRequestSubmitted(event: RequestSubmitted): void {
  const transferHistory = ensureTransferHistory(
    event.transaction.hash,
    event.transactionLogIndex,
    event.block.timestamp
  )

  transferHistory.token = event.params.token
  transferHistory.sender = event.params.sender
  transferHistory.recipient = event.params.recipient
  transferHistory.amount = event.params.amount

  transferHistory.save()
}
