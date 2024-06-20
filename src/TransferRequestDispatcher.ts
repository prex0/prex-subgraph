import { Transferred } from '../generated/TransferRequestDispatcher/TransferRequestDispatcher'
import { ensureTransferHistory } from './helpers'

export function handleTransferred(event: Transferred): void {
  const transferHistory = ensureTransferHistory(
    event.transaction.hash,
    event.block.timestamp
  )

  transferHistory.token = event.params.token
  transferHistory.sender = event.params.from
  transferHistory.recipient = event.params.to
  transferHistory.amount = event.params.amount

  transferHistory.save()
}
