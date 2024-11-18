import { BigInt } from '@graphprotocol/graph-ts'
import {
  Submitted,
  Deposited,
  Received,
  RequestCancelled,
  RequestExpired
} from '../generated/TokenDistributor/TokenDistributor'
import {
  createCoinMovingHistory,
  ensureEndUser,
  ensureTokenDistributeRequest,
  ensureToken
} from './helpers'

export function handleSubmitted(event: Submitted): void {
  const tokenDistributeRequest = ensureTokenDistributeRequest(
    event.params.id,
    event.block.timestamp
  )

  const token = ensureToken(event.params.token, event.block.timestamp)
  token.save()

  const sender = ensureEndUser(event.params.sender, event.block.timestamp)
  sender.save()

  const distributorContract = ensureEndUser(
    event.address,
    event.block.timestamp
  )
  distributorContract.save()

  tokenDistributeRequest.token = token.id
  tokenDistributeRequest.sender = sender.id
  tokenDistributeRequest.publicKey = event.params.publicKey
  tokenDistributeRequest.amount = event.params.amount
  tokenDistributeRequest.totalAmount = event.params.amount
  tokenDistributeRequest.amountPerWithdrawal = event.params.amountPerWithdrawal
  tokenDistributeRequest.cooltime = event.params.cooltime
  tokenDistributeRequest.maxAmountPerAddress = event.params.maxAmountPerAddress
  tokenDistributeRequest.name = event.params.name
  tokenDistributeRequest.coordinate = event.params.coordinate
  tokenDistributeRequest.txHash = event.transaction.hash
  tokenDistributeRequest.expiry = event.params.expiry
  tokenDistributeRequest.status = 'PENDING'

  tokenDistributeRequest.save()

  createCoinMovingHistory(
    event.transaction.hash,
    event.logIndex,
    event.block.timestamp,
    token.id,
    sender.id,
    distributorContract.id,
    event.params.amount,
    'TOKEN_DISTRIBUTE',
    null,
    null,
    event.params.name,
    tokenDistributeRequest.id
  )
}

export function handleDeposited(event: Deposited): void {
  const tokenDistributeRequest = ensureTokenDistributeRequest(
    event.params.id,
    event.block.timestamp
  )

  tokenDistributeRequest.amount = tokenDistributeRequest.amount.plus(
    event.params.amount
  )
  tokenDistributeRequest.totalAmount = tokenDistributeRequest.totalAmount.plus(
    event.params.amount
  )
  tokenDistributeRequest.save()

  const depositor = ensureEndUser(event.params.depositor, event.block.timestamp)
  depositor.save()

  const distributorContract = ensureEndUser(
    event.address,
    event.block.timestamp
  )
  distributorContract.save()

  createCoinMovingHistory(
    event.transaction.hash,
    event.logIndex,
    event.block.timestamp,
    tokenDistributeRequest.token,
    depositor.id,
    distributorContract.id,
    event.params.amount,
    'TOKEN_DISTRIBUTE',
    null,
    null,
    tokenDistributeRequest.name,
    tokenDistributeRequest.id
  )
}

export function handleReceived(event: Received): void {
  const tokenDistributeRequest = ensureTokenDistributeRequest(
    event.params.id,
    event.block.timestamp
  )

  tokenDistributeRequest.amount = tokenDistributeRequest.amount.minus(
    event.params.amount
  )

  tokenDistributeRequest.save()

  const recipient = ensureEndUser(event.params.recipient, event.block.timestamp)
  recipient.save()

  const distributorContract = ensureEndUser(
    event.address,
    event.block.timestamp
  )
  distributorContract.save()

  createCoinMovingHistory(
    event.transaction.hash,
    event.logIndex,
    event.block.timestamp,
    tokenDistributeRequest.token,
    distributorContract.id,
    recipient.id,
    event.params.amount,
    'TOKEN_DISTRIBUTE',
    null,
    tokenDistributeRequest.name,
    null,
    tokenDistributeRequest.id
  )
}

export function handleRequestCancelled(event: RequestCancelled): void {
  const tokenDistributeRequest = ensureTokenDistributeRequest(
    event.params.id,
    event.block.timestamp
  )

  tokenDistributeRequest.status = 'CANCELLED'
  tokenDistributeRequest.amount = BigInt.zero()

  tokenDistributeRequest.save()

  const distributorContract = ensureEndUser(
    event.address,
    event.block.timestamp
  )
  distributorContract.save()

  createCoinMovingHistory(
    event.transaction.hash,
    event.logIndex,
    event.block.timestamp,
    tokenDistributeRequest.token,
    distributorContract.id,
    tokenDistributeRequest.sender,
    event.params.amount,
    'TOKEN_DISTRIBUTE',
    null,
    tokenDistributeRequest.name,
    null,
    tokenDistributeRequest.id
  )
}

export function handleRequestExpired(event: RequestExpired): void {
  const tokenDistributeRequest = ensureTokenDistributeRequest(
    event.params.id,
    event.block.timestamp
  )

  tokenDistributeRequest.status = 'COMPLETED'
  tokenDistributeRequest.amount = BigInt.zero()

  tokenDistributeRequest.save()

  const distributorContract = ensureEndUser(
    event.address,
    event.block.timestamp
  )
  distributorContract.save()

  createCoinMovingHistory(
    event.transaction.hash,
    event.logIndex,
    event.block.timestamp,
    tokenDistributeRequest.token,
    distributorContract.id,
    tokenDistributeRequest.sender,
    event.params.amount,
    'TOKEN_DISTRIBUTE',
    null,
    tokenDistributeRequest.name,
    null,
    tokenDistributeRequest.id
  )
}
