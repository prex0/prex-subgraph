import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts'
import {
  OrderFilled,
  TokenIssued
} from '../generated/FanController/FanController'
import { PumActionHistory, PumToken } from '../generated/schema'
import {
  ensurePumToken,
  ensurePumActionHistory,
  ensureEndUser,
  ensureToken,
  ensurePumTokenPrice
} from './helpers'
import {
  CommunityPool,
  MarketStatusUpdated,
  Swap
} from '../generated/FanController/CommunityPool'
import { FanController } from '../generated/FanController/FanController'
import { ERC20 } from '../generated/FanController/ERC20'

export function handleMarketStatusUpdated(event: MarketStatusUpdated): void {
  const pumToken = ensurePumToken(
    event.params.communityToken,
    event.block.timestamp
  )

  pumToken.isMarketOpen = event.params.sellable

  pumToken.save()
}

export function handleSwap(event: Swap): void {
  const pumToken = ensurePumToken(
    event.params.communityToken,
    event.block.timestamp
  )

  pumToken.reserveCT = event.params.reserveCT
  pumToken.reserveStable = event.params.reserveStable

  const pumTokenPrice = ensurePumTokenPrice(
    pumToken.id,
    'HOUR',
    event.block.timestamp
  )

  const price = event.params.reserveStable

  if (pumTokenPrice.open === BigInt.fromI32(0)) {
    pumTokenPrice.open = price
  }

  if (pumTokenPrice.high === BigInt.fromI32(0)) {
    pumTokenPrice.high = price
  }

  if (pumTokenPrice.low === BigInt.fromI32(0)) {
    pumTokenPrice.low = price
  }

  if (price > pumTokenPrice.high) {
    pumTokenPrice.high = price
  }

  if (price < pumTokenPrice.low) {
    pumTokenPrice.low = price
  }

  pumTokenPrice.close = price  

  pumTokenPrice.volume = pumTokenPrice.volume.plus(event.params.deltaStable.abs())
  pumTokenPrice.traderCount = pumTokenPrice.traderCount.plus(BigInt.fromI32(1))

  pumTokenPrice.save()

  pumToken.save()
}

