import {
  PointBought
} from '../generated/PointMarket/PointMarket'
import {
  ensurePumActionHistory,
  ensureEndUser
} from './helpers'
import { savePumProfileBadge } from './helpers/badge'

export function handlePointBought(event: PointBought): void {
  const endUser = ensureEndUser(event.params.buyer, event.block.timestamp)

  const pumActionHistory = ensurePumActionHistory(
    endUser.id,
    event.transaction.hash,
    'POINT',
    event.block.timestamp
  )

  pumActionHistory.amountIn = event.params.amount
  pumActionHistory.amountOut = event.params.method
  pumActionHistory.metadata = event.params.orderId.toHex()

  endUser.save()
  pumActionHistory.save()

  // badge
  savePumProfileBadge(endUser.id, 'POINT_BUYER', event.block.timestamp)
}