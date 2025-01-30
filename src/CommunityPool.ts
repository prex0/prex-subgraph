import { BigInt } from '@graphprotocol/graph-ts'
import { ensurePumToken, ensurePumTokenPrice } from './helpers'
import {
  MarketStatusUpdated,
  Swap
} from '../generated/FanController/CommunityPool'

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

  updatePumTokenPrice(pumToken.id, event, 'HOUR')
  updatePumTokenPrice(pumToken.id, event, 'DAY')

  pumToken.save()
}

function updatePumTokenPrice(id: string, event: Swap, interval: string): void {
  const pumTokenPrice = ensurePumTokenPrice(id, interval, event.block.timestamp)

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

  pumTokenPrice.volume = pumTokenPrice.volume.plus(
    event.params.deltaStable.abs()
  )
  pumTokenPrice.traderCount = pumTokenPrice.traderCount.plus(BigInt.fromI32(1))

  pumTokenPrice.save()
}
