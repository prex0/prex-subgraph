import { Address, BigInt } from '@graphprotocol/graph-ts'
import {
  MetadataUpdated,
  OrderFilled,
  TokenIssued
} from '../generated/FanController/FanController'
import {
  ensurePumToken,
  ensurePumActionHistory,
  ensureEndUser,
  ensureToken,
  existsTokenHolder,
  updateTokenHolder,
  ensurePumTokenPrice
} from './helpers'
import { ERC20 } from '../generated/FanController/ERC20'
import { EndUser, PumToken } from '../generated/schema'
import { savePumProfileBadge } from './helpers/badge'

export function handleTokenIssued(event: TokenIssued): void {
  const token = ensureToken(event.params.communityToken, event.block.timestamp)
  token.save()

  const pumToken = ensurePumToken(
    event.params.communityToken,
    event.block.timestamp
  )
  pumToken.token = token.id

  const endUser = ensureEndUser(event.params.issuer, event.block.timestamp)

  pumToken.name = event.params.name
  pumToken.symbol = event.params.symbol
  pumToken.metadata = event.params.metadata
  pumToken.issuer = endUser.id

  pumToken.save()

  const pumActionHistory = ensurePumActionHistory(
    endUser.id,
    event.transaction.hash,
    'ISSUE',
    event.block.timestamp
  )

  pumActionHistory.token = pumToken.id
  pumActionHistory.amountIn = event.params.amountPoint
  pumActionHistory.metadata = event.params.metadata

  pumActionHistory.save()

  // badge
  savePumProfileBadge(endUser.id, 'ISSUER', event.block.timestamp)
}

export function handleMetadataUpdated(event: MetadataUpdated): void {
  const pumToken = ensurePumToken(
    event.params.communityToken,
    event.block.timestamp
  )
  pumToken.metadata = event.params.metadata
  pumToken.save()
}

export function handleOrderFilled(event: OrderFilled): void {
  const token = ensureToken(event.params.communityToken, event.block.timestamp)
  token.save()

  const pumToken = ensurePumToken(
    event.params.communityToken,
    event.block.timestamp
  )
  pumToken.token = token.id

  const endUser = ensureEndUser(event.params.sender, event.block.timestamp)
  const recipient = ensureEndUser(event.params.recipient, event.block.timestamp)

  const pumActionHistory = ensurePumActionHistory(
    endUser.id,
    event.transaction.hash,
    event.params.isBuy ? 'BUY' : 'SELL',
    event.block.timestamp
  )

  pumActionHistory.token = pumToken.id
  pumActionHistory.recipient = recipient.id
  pumActionHistory.amountIn = event.params.amountIn
  pumActionHistory.amountOut = event.params.amountOut

  pumActionHistory.save()

  const userBalance = ERC20.bind(event.params.communityToken).balanceOf(
    Address.fromString(endUser.id)
  )

  if (!existsTokenHolder(token.id, endUser.id)) {
    pumToken.uniqueBuyers = pumToken.uniqueBuyers.plus(BigInt.fromI32(1))
  }
  pumToken.save()

  updateTokenHolder(token.id, endUser.id, userBalance, event.block.timestamp)

  addTraderInPumTokenPrice(pumToken, endUser, 'HOUR', event)
  addTraderInPumTokenPrice(pumToken, endUser, 'DAY', event)

  // badge
  savePumProfileBadge(pumToken.issuer, 'PUMPED', event.block.timestamp)

  if(pumToken.uniqueBuyers.gt(BigInt.fromI32(10))) { 
    savePumProfileBadge(pumToken.issuer, 'HOLDER_10', event.block.timestamp)
  }

  if(pumToken.uniqueBuyers.gt(BigInt.fromI32(100))) { 
    savePumProfileBadge(pumToken.issuer, 'HOLDER_100', event.block.timestamp)
  }

  if(pumToken.uniqueBuyers.gt(BigInt.fromI32(1000))) { 
    savePumProfileBadge(pumToken.issuer, 'HOLDER_1000', event.block.timestamp)
  }
}

function addTraderInPumTokenPrice(
  pumToken: PumToken,
  endUser: EndUser,
  interval: string,
  event: OrderFilled
): void {
  const pumTokenPrice = ensurePumTokenPrice(
    pumToken.id,
    interval,
    event.block.timestamp
  )

  if (event.params.isBuy) {
    pumTokenPrice.buyers = pumTokenPrice.buyers.concat([endUser.id])
  } else {
    pumTokenPrice.sellers = pumTokenPrice.sellers.concat([endUser.id])
  }

  pumTokenPrice.save()
}
