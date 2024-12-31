import { BigInt, Bytes } from '@graphprotocol/graph-ts'
import {
  OrderFilled,
  TokenIssued
} from '../generated/FanController/FanController'
import { PumToken, PumTokenOrders } from '../generated/schema'
import { ensureEndUser } from './helpers'

export function handleTokenIssued(event: TokenIssued): void {
  const pumToken = ensurePumToken(event.params.communityToken, event.block.timestamp)
  const endUser = ensureEndUser(event.params.issuer, event.block.timestamp)

  pumToken.name = event.params.name
  pumToken.symbol = event.params.symbol
  pumToken.issuer = endUser.id

  pumToken.save()
}

export function handleOrderFilled(event: OrderFilled): void {
  const pumToken = ensurePumToken(event.params.communityToken, event.block.timestamp)
  const endUser = ensureEndUser(event.params.sender, event.block.timestamp)

  const pumTokenOrder = new PumTokenOrders(event.transaction.hash.toHex())
  pumTokenOrder.token = pumToken.id
  pumTokenOrder.swapper = endUser.id
  pumTokenOrder.isBuy = event.params.isBuy
  pumTokenOrder.amountIn = event.params.amountIn
  pumTokenOrder.amountOut = event.params.amountOut
  pumTokenOrder.txHash = event.transaction.hash
  pumTokenOrder.createdAt = event.block.timestamp

  pumTokenOrder.save()
}


function ensurePumToken(address: Bytes, timestamp: BigInt): PumToken {
  const id = address.toHex()
  let pumToken = PumToken.load(id)

  if (!pumToken) {
    pumToken = new PumToken(id)
    pumToken.address = address
    pumToken.createdAt = timestamp
  }

  pumToken.updatedAt = timestamp

  return pumToken
}
