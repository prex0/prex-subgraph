import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts'
import {
  OnetimeLock,
  TokenDistributeRequest,
  TransferRequest,
  TransferWithSecret,
  CoinMovingHistory,
  Token,
  EndUser
} from '../generated/schema'

// type MovingType = "NONE" | "DIRECT" | "SECRET" | "ONETIME" | "EXPIRING"

export function ensureToken(tokenAddress: Address, eventTime: BigInt): Token {
  const id = tokenAddress.toHex()

  let token = Token.load(id)

  if (token == null) {
    token = new Token(id)
    token.createdAt = eventTime
  }

  token.updatedAt = eventTime

  return token
}

export function ensureEndUser(
  userAddress: Address,
  eventTime: BigInt
): EndUser {
  const id = userAddress.toHex()

  let user = EndUser.load(id)

  if (user == null) {
    user = new EndUser(id)
    user.createdAt = eventTime
  }

  user.updatedAt = eventTime

  return user
}

export function ensureCoinMovingHistory(
  txHash: Bytes,
  logIndex: BigInt,
  eventTime: BigInt
): CoinMovingHistory {
  const id = txHash.toHex() + '-' + logIndex.toString()

  let coinMovingHistory = CoinMovingHistory.load(id)

  if (coinMovingHistory == null) {
    coinMovingHistory = new CoinMovingHistory(id)

    coinMovingHistory.txHash = txHash
    coinMovingHistory.amount = BigInt.zero()
    coinMovingHistory.metadata = Bytes.empty()
    coinMovingHistory.createdAt = eventTime
    coinMovingHistory.movingType = 'NONE'
  }

  return coinMovingHistory
}

export function createCoinMovingHistory(
  txHash: Bytes,
  logIndex: BigInt,
  eventTime: BigInt,
  tokenId: string,
  senderId: string,
  recipientId: string,
  amount: BigInt,
  movingType: string,
  metadata: Bytes | null,
  senderName: string | null,
  recipientName: string | null,
  tokenDistributeRequestId: string | null
): void {
  const coinMoving = ensureCoinMovingHistory(txHash, logIndex, eventTime)

  coinMoving.token = tokenId
  coinMoving.sender = senderId
  coinMoving.senderName = senderName
  coinMoving.recipient = recipientId
  coinMoving.recipientName = recipientName
  coinMoving.amount = amount
  coinMoving.metadata = metadata
  coinMoving.movingType = movingType
  coinMoving.tokenDistributeRequest = tokenDistributeRequestId

  coinMoving.save()
}

export function ensureTransferRequest(
  txHash: Bytes,
  logIndex: BigInt,
  eventTime: BigInt
): TransferRequest {
  const id = txHash.toHex() + '-' + logIndex.toString()

  let transferHistory = TransferRequest.load(id)

  if (transferHistory == null) {
    transferHistory = new TransferRequest(id)

    transferHistory.txHash = txHash
    transferHistory.amount = BigInt.zero()
    transferHistory.metadata = Bytes.empty()
    transferHistory.createdAt = eventTime
  }

  return transferHistory
}

export function ensureTransferWithSecret(
  txHash: Bytes,
  logIndex: BigInt,
  eventTime: BigInt
): TransferWithSecret {
  const id = txHash.toHex() + '-' + logIndex.toString()

  let transferHistory = TransferWithSecret.load(id)

  if (transferHistory == null) {
    transferHistory = new TransferWithSecret(id)

    transferHistory.txHash = txHash
    transferHistory.amount = BigInt.zero()
    transferHistory.status = 'LIVE'
    transferHistory.metadata = Bytes.empty()
    transferHistory.createdAt = eventTime
  }

  transferHistory.updatedAt = eventTime

  return transferHistory
}

export function ensureOnetimeLock(
  lockId: Bytes,
  eventTime: BigInt
): OnetimeLock {
  const id = lockId.toHex()

  let onetimeLock = OnetimeLock.load(id)

  if (onetimeLock == null) {
    onetimeLock = new OnetimeLock(id)

    onetimeLock.amount = BigInt.zero()
    onetimeLock.expiry = BigInt.zero()
    onetimeLock.metadata = Bytes.empty()
    onetimeLock.createdAt = eventTime
    onetimeLock.status = 'LIVE'
  }

  onetimeLock.updatedAt = eventTime

  return onetimeLock
}

export function ensureTokenDistributeRequest(
  requestId: Bytes,
  eventTime: BigInt
): TokenDistributeRequest {
  const id = requestId.toHex()

  let tokenDistributeRequest = TokenDistributeRequest.load(id)

  if (tokenDistributeRequest == null) {
    tokenDistributeRequest = new TokenDistributeRequest(id)

    tokenDistributeRequest.amount = BigInt.zero()
    tokenDistributeRequest.amountPerWithdrawal = BigInt.zero()
    tokenDistributeRequest.expiry = BigInt.zero()
    tokenDistributeRequest.createdAt = eventTime
  }

  return tokenDistributeRequest
}
