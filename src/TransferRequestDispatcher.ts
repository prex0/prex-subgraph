import { Transferred } from '../generated/TransferRequestDispatcherV2/TransferRequestDispatcher'
import {
  createCoinMovingHistory,
  ensureEndUser,
  ensureToken,
  ensureTransferRequest,
  updateTokenHolderParams
} from './helpers'
import { savePumProfileBadge } from './helpers/badge'

export function handleTransferred(event: Transferred): void {
  const transferHistory = ensureTransferRequest(
    event.transaction.hash,
    event.transactionLogIndex,
    event.block.timestamp
  )
  const token = ensureToken(event.params.token, event.block.timestamp)

  token.save()

  const from = ensureEndUser(event.params.from, event.block.timestamp)
  const to = ensureEndUser(event.params.to, event.block.timestamp)

  from.save()
  to.save()

  transferHistory.token = token.id
  transferHistory.sender = from.id
  transferHistory.recipient = to.id
  transferHistory.amount = event.params.amount
  transferHistory.metadata = event.params.metadata

  transferHistory.save()

  createCoinMovingHistory(
    event.transaction.hash,
    event.transactionLogIndex,
    event.block.timestamp,
    token.id,
    from.id,
    to.id,
    event.params.amount,
    'DIRECT',
    event.params.metadata,
    null,
    null,
    null
  )

  updateTokenHolderParams(
    token.id,
    to.id,
    from.id,
    event.params.amount,
    event.block.timestamp
  )

  // badge
  savePumProfileBadge(to.id, 'TRANSFER', event.block.timestamp)
}
