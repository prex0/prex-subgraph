import { BigInt } from '@graphprotocol/graph-ts'
import {
  PumProfileBadge
} from '../../generated/schema'


export function ensurePumProfileBadge(
  user: string,
  title: string,
  timestamp: BigInt
): PumProfileBadge {
  const id = user + "-" + title
  let pumTokenPrice = PumProfileBadge.load(id)

  if (!pumTokenPrice) {
    pumTokenPrice = new PumProfileBadge(id)

    pumTokenPrice.user = user
    pumTokenPrice.title = title
    pumTokenPrice.createdAt = timestamp

    pumTokenPrice.save()
  }

  return pumTokenPrice
}

export function savePumProfileBadge(
  user: string,
  title: string,
  timestamp: BigInt
): void {
  ensurePumProfileBadge(user, title, timestamp)
}
