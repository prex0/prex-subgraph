import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts'
import { ExpiringLock, OnetimeLock, TransferHistory } from '../generated/schema'


export function ensureTransferHistory(
  txHash: Bytes,
  eventTime: BigInt
): TransferHistory {
  const id = txHash.toString()

  let transferHistory = TransferHistory.load(id)

  if (transferHistory == null) {
    transferHistory = new TransferHistory(id)

    transferHistory.txHash = txHash
    transferHistory.token = Address.zero()
    transferHistory.sender = Address.zero()
    transferHistory.recipient = Address.zero()
    transferHistory.amount = BigInt.zero()
    transferHistory.createdAt = eventTime
  }

  transferHistory.updatedAt = eventTime

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
    onetimeLock.metadata = Bytes.empty()
    onetimeLock.createdAt = eventTime
  }

  onetimeLock.updatedAt = eventTime

  return onetimeLock
}


export function ensureExpiringLock(
  lockId: Bytes,
  eventTime: BigInt
): ExpiringLock {
  const id = lockId.toString()

  let onetimeLock = ExpiringLock.load(id)

  if (onetimeLock == null) {
    onetimeLock = new ExpiringLock(id)

    onetimeLock.token = Address.zero()
    onetimeLock.sender = Address.zero()
    onetimeLock.amount = BigInt.zero()
    onetimeLock.createdAt = eventTime
  }

  onetimeLock.updatedAt = eventTime

  return onetimeLock
}
