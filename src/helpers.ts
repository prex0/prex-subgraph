import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts'
import {
  ExpiringLock,
  ExpiringLockDeposit,
  ExpiringLockDistribution,
  OnetimeLock,
  TransferRequest,
  TransferWithSecret,
  CoinMovingHistory
} from '../generated/schema'

// type MovingType = "NONE" | "DIRECT" | "SECRET" | "ONETIME" | "EXPIRING"

export function ensureCoinMovingHistory(
  txHash: Bytes,
  logIndex: BigInt,
  eventTime: BigInt
): CoinMovingHistory {
  const id = txHash.toString() + '-' + logIndex.toString()

  let coinMovingHistory = CoinMovingHistory.load(id)

  if (coinMovingHistory == null) {
    coinMovingHistory = new CoinMovingHistory(id)

    coinMovingHistory.txHash = txHash
    coinMovingHistory.token = Address.zero()
    coinMovingHistory.sender = Address.zero()
    coinMovingHistory.recipient = Address.zero()
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
  token: Address,
  sender: Address,
  recipient: Address,
  amount: BigInt,
  metadata: Bytes,
  movingType: string
): void {
  const coinMoving = ensureCoinMovingHistory(txHash, logIndex, eventTime)

  coinMoving.token = token
  coinMoving.sender = sender
  coinMoving.recipient = recipient
  coinMoving.amount = amount
  coinMoving.metadata = metadata
  coinMoving.movingType = movingType

  coinMoving.save()
}

export function ensureTransferRequest(
  txHash: Bytes,
  logIndex: BigInt,
  eventTime: BigInt
): TransferRequest {
  const id = txHash.toString() + '-' + logIndex.toString()

  let transferHistory = TransferRequest.load(id)

  if (transferHistory == null) {
    transferHistory = new TransferRequest(id)

    transferHistory.txHash = txHash
    transferHistory.token = Address.zero()
    transferHistory.sender = Address.zero()
    transferHistory.recipient = Address.zero()
    transferHistory.amount = BigInt.zero()
    transferHistory.metadata = Bytes.empty()
    transferHistory.createdAt = eventTime
  }

  return transferHistory
}

export function ensureTransferWithSecret(
  id: Bytes,
  eventTime: BigInt,
  txHash: Bytes
): TransferWithSecret {
  const idStr = id.toString()

  let transferHistory = TransferWithSecret.load(idStr)

  if (transferHistory == null) {
    transferHistory = new TransferWithSecret(idStr)

    transferHistory.txHash = txHash
    transferHistory.token = Address.zero()
    transferHistory.sender = Address.zero()
    transferHistory.recipient = Address.zero()
    transferHistory.amount = BigInt.zero()
    transferHistory.metadata = Bytes.empty()
    transferHistory.createdAt = eventTime
  }

  return transferHistory
}

export function ensureOnetimeLock(
  lockId: Bytes,
  eventTime: BigInt
): OnetimeLock {
  const id = lockId.toString()

  let onetimeLock = OnetimeLock.load(id)

  if (onetimeLock == null) {
    onetimeLock = new OnetimeLock(id)

    onetimeLock.token = Address.zero()
    onetimeLock.sender = Address.zero()
    onetimeLock.amount = BigInt.zero()
    onetimeLock.expiry = BigInt.zero()
    onetimeLock.metadata = Bytes.empty()
    onetimeLock.createdAt = eventTime
    onetimeLock.status = 'LIVE'
  }

  onetimeLock.updatedAt = eventTime

  return onetimeLock
}

export function ensureExpiringLock(
  lockId: Bytes,
  eventTime: BigInt
): ExpiringLock {
  const id = lockId.toString()

  let expiringLock = ExpiringLock.load(id)

  if (expiringLock == null) {
    expiringLock = new ExpiringLock(id)

    expiringLock.token = Address.zero()
    expiringLock.sender = Address.zero()
    expiringLock.amount = BigInt.zero()
    expiringLock.expiry = BigInt.zero()
    expiringLock.createdAt = eventTime
  }

  expiringLock.updatedAt = eventTime

  return expiringLock
}

export function ensureExpiringLockDeposit(
  txHash: Bytes,
  logIndex: BigInt,
  lockId: Bytes,
  eventTime: BigInt
): ExpiringLockDeposit {
  const id = txHash.toString() + '-' + logIndex.toString()

  let deposit = ExpiringLockDeposit.load(id)

  if (deposit == null) {
    deposit = new ExpiringLockDeposit(id)

    deposit.parent = lockId.toString()
    deposit.depositor = Address.zero()
    deposit.amount = BigInt.zero()
    deposit.metadata = Bytes.empty()
    deposit.createdAt = eventTime
  }

  return deposit
}

export function ensureExpiringLockDistribution(
  txHash: Bytes,
  logIndex: BigInt,
  lockId: Bytes,
  eventTime: BigInt
): ExpiringLockDistribution {
  const id = txHash.toString() + '-' + logIndex.toString()

  let distribution = ExpiringLockDistribution.load(id)

  if (distribution == null) {
    distribution = new ExpiringLockDistribution(id)

    distribution.parent = lockId.toString()
    distribution.recipient = Address.zero()
    distribution.amount = BigInt.zero()
    distribution.metadata = Bytes.empty()
    distribution.createdAt = eventTime
  }

  return distribution
}
