import { BigInt, Bytes } from '@graphprotocol/graph-ts'
import {
  OrderFilled,
  TokenIssued
} from '../generated/FanController/FanController'
import { PumActionHistory, PumToken } from '../generated/schema'
import { ensureEndUser } from './helpers'
import { CommunityPool } from '../generated/FanController/CommunityPool'
import { FanController } from '../generated/FanController/FanController'

export function handleTokenIssued(event: TokenIssued): void {
  const pumToken = ensurePumToken(
    event.params.communityToken,
    event.block.timestamp
  )
  const endUser = ensureEndUser(event.params.issuer, event.block.timestamp)

  pumToken.name = event.params.name
  pumToken.symbol = event.params.symbol
  pumToken.issuer = endUser.id

  pumToken.save()

  const pumActionHistory = ensurePumActionHistory(endUser.id, pumToken.id, event.transaction.hash, event.logIndex)

  pumActionHistory.action = "ISSUE"

  pumActionHistory.save()
}

export function handleOrderFilled(event: OrderFilled): void {
  const pumToken = ensurePumToken(
    event.params.communityToken,
    event.block.timestamp
  )
  const endUser = ensureEndUser(event.params.sender, event.block.timestamp)
  const recipient = ensureEndUser(event.params.recipient, event.block.timestamp)

  // Update market cap
  const fanController = FanController.bind(event.address)
  const communityPool = CommunityPool.bind(fanController.communityPool())
  const marketInfo = communityPool.getMarketInfo(event.params.communityToken)

  pumToken.marketCap = marketInfo.reserveStable

  pumToken.save()

  const pumActionHistory = ensurePumActionHistory(endUser.id, pumToken.id, event.transaction.hash, event.logIndex)

  if (event.params.isBuy) {
    pumActionHistory.action = "BUY"
  } else {
    pumActionHistory.action = "SELL"
  }

  pumActionHistory.recipient = recipient.id
  pumActionHistory.amountIn = event.params.amountIn
  pumActionHistory.amountOut = event.params.amountOut

  pumActionHistory.save()
}

function ensurePumToken(address: Bytes, timestamp: BigInt): PumToken {
  const id = address.toHex()
  let pumToken = PumToken.load(id)

  if (!pumToken) {
    pumToken = new PumToken(id)
    pumToken.address = address
    pumToken.marketCap = BigInt.fromI32(0)
    pumToken.createdAt = timestamp
  }

  pumToken.updatedAt = timestamp

  return pumToken
}

function ensurePumActionHistory(user: string, token: string, txHash: Bytes, logIndex: BigInt): PumActionHistory {
  const id = `${user}-${token}-${txHash.toHex()}-${logIndex.toString()}`
  let pumActionHistory = PumActionHistory.load(id)

  if (!pumActionHistory) {
    pumActionHistory = new PumActionHistory(id)
    pumActionHistory.user = user
    pumActionHistory.token = token
    pumActionHistory.action = "ISSUE"
    pumActionHistory.txHash = txHash
  }

  return pumActionHistory
}

