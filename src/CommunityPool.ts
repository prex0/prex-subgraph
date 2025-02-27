import { BigInt } from '@graphprotocol/graph-ts'
import { ensurePumToken, ensurePumTokenPrice } from './helpers'
import {
  MarketStatusUpdated,
  Swap
} from '../generated/FanController/CommunityPool'
import { PumTokenPrice } from '../generated/schema'
import { calculatePrice } from './helpers/price'

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

  const previousPrice = pumToken.price

  pumToken.reserveCT = event.params.reserveCT
  pumToken.reserveStable = event.params.reserveStable
  pumToken.price = calculatePrice(event.params.reserveStable)

  updatePumTokenPrice(pumToken.id, event, 'HOUR', previousPrice, pumToken.price)
  const pumTokenPriceDay = updatePumTokenPrice(pumToken.id, event, 'DAY', previousPrice, pumToken.price)
  
  pumToken.latestPriceDay = pumTokenPriceDay.id

  pumToken.save()
}

function updatePumTokenPrice(id: string, event: Swap, interval: string, previousPrice: BigInt, currentPrice: BigInt): PumTokenPrice {
  const pumTokenPrice = ensurePumTokenPrice(id, interval, event.block.timestamp)

  if (pumTokenPrice.open.isZero()) {
    pumTokenPrice.open = previousPrice
  }

  if (pumTokenPrice.high.isZero()) {
    pumTokenPrice.high = previousPrice
  }

  if (pumTokenPrice.low.isZero()) {
    pumTokenPrice.low = previousPrice
  }

  if (currentPrice.gt(pumTokenPrice.high)) {
    pumTokenPrice.high = currentPrice
  }

  if (currentPrice.lt(pumTokenPrice.low)) {
    pumTokenPrice.low = currentPrice
  }

  pumTokenPrice.close = currentPrice

  pumTokenPrice.change = calculateChange(pumTokenPrice.open, pumTokenPrice.close)

  pumTokenPrice.volume = pumTokenPrice.volume.plus(
    event.params.deltaStable.abs()
  )
  pumTokenPrice.traderCount = pumTokenPrice.traderCount.plus(BigInt.fromI32(1))

  pumTokenPrice.save()

  return pumTokenPrice
}

function calculateChange(before: BigInt, after: BigInt): BigInt {
  if (before.isZero()) return BigInt.fromI32(0);

  return after.minus(before).times(BigInt.fromI32(10000)).div(before)
}
