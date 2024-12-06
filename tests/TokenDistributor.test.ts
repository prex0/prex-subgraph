import { Address, BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts'; //
import { assert, describe, newMockEvent, test, beforeEach } from 'matchstick-as';
import { Submitted, Received, RequestCancelled, RequestExpired } from '../generated/TokenDistributor/TokenDistributor';
import { handleSubmitted, handleReceived, handleRequestCancelled, handleRequestExpired } from '../src/TokenDistributor';
import { TokenDistributeRequest } from '../generated/schema';

export const MOCK_EVENT = newMockEvent()

const ZERO_HASH = '0x0000000000000000000000000000000000000000000000000000000000000000'
const ADDRESS_ONE = '0x0000000000000000000000000000000000000001'

const REQUEST_ID = ZERO_HASH

describe("handleSubmitted", () => {
  test('check handleSubmitted', () => {
    const requestSubmittedEvent = new Submitted(
      Address.zero(),
      MOCK_EVENT.logIndex,
      MOCK_EVENT.transactionLogIndex,
      MOCK_EVENT.logType,
      MOCK_EVENT.block,
      MOCK_EVENT.transaction,
      [
        new ethereum.EventParam('id', ethereum.Value.fromBytes(Bytes.fromHexString(REQUEST_ID))),
        new ethereum.EventParam('token', ethereum.Value.fromAddress(Address.zero())),
        new ethereum.EventParam('sender', ethereum.Value.fromAddress(Address.zero())),
        new ethereum.EventParam('amount', ethereum.Value.fromSignedBigInt(BigInt.fromI32(100))),
        new ethereum.EventParam('amountPerWithdrawal', ethereum.Value.fromSignedBigInt(BigInt.fromI32(10))),
        new ethereum.EventParam('cooltime', ethereum.Value.fromSignedBigInt(BigInt.fromI32(10))),
        new ethereum.EventParam('maxAmountPerAddress', ethereum.Value.fromSignedBigInt(BigInt.fromI32(100))),
        new ethereum.EventParam('expiry', ethereum.Value.fromSignedBigInt(BigInt.fromI32(100))),
        new ethereum.EventParam('name', ethereum.Value.fromString('name')),
        new ethereum.EventParam('coordinate', ethereum.Value.fromBytes(Bytes.fromHexString(ZERO_HASH))),
      ],
      MOCK_EVENT.receipt,
    )

    handleSubmitted(requestSubmittedEvent)

    const id = `${MOCK_EVENT.transaction.hash.toHex()}-${MOCK_EVENT.logIndex.toString()}`

    const tokenDistributeRequest = TokenDistributeRequest.load(REQUEST_ID)

    assert.assertTrue(tokenDistributeRequest != null)

    assert.entityCount('TokenDistributeRequest', 1)
    assert.fieldEquals('TokenDistributeRequest', REQUEST_ID, 'id', REQUEST_ID)
    assert.fieldEquals('TokenDistributeRequest', REQUEST_ID, 'amount', '100')

    assert.entityCount('CoinMovingHistory', 1)
    assert.fieldEquals('CoinMovingHistory', id, 'id', id)
    assert.fieldEquals('CoinMovingHistory', id, 'amount', '100')
  })
})

describe("handleReceived", () => {
  beforeEach(() => {
    const requestSubmittedEvent = new Submitted(
      Address.zero(),
      MOCK_EVENT.logIndex,
      MOCK_EVENT.transactionLogIndex,
      MOCK_EVENT.logType,
      MOCK_EVENT.block,
      MOCK_EVENT.transaction,
      [
        new ethereum.EventParam('id', ethereum.Value.fromBytes(Bytes.fromHexString(REQUEST_ID))),
        new ethereum.EventParam('token', ethereum.Value.fromAddress(Address.zero())),
        new ethereum.EventParam('sender', ethereum.Value.fromAddress(Address.zero())),
        new ethereum.EventParam('amount', ethereum.Value.fromSignedBigInt(BigInt.fromI32(100))),
        new ethereum.EventParam('amountPerWithdrawal', ethereum.Value.fromSignedBigInt(BigInt.fromI32(10))),
        new ethereum.EventParam('cooltime', ethereum.Value.fromSignedBigInt(BigInt.fromI32(10))),
        new ethereum.EventParam('maxAmountPerAddress', ethereum.Value.fromSignedBigInt(BigInt.fromI32(100))),
        new ethereum.EventParam('expiry', ethereum.Value.fromSignedBigInt(BigInt.fromI32(100))),
        new ethereum.EventParam('name', ethereum.Value.fromString('name')),
        new ethereum.EventParam('coordinate', ethereum.Value.fromBytes(Bytes.fromHexString(ZERO_HASH))),
      ],
      MOCK_EVENT.receipt,
    )

    handleSubmitted(requestSubmittedEvent)
  })

  test('check handleReceived', () => {
    const requestReceivedEvent = new Received(
      Address.zero(),
      MOCK_EVENT.logIndex,
      MOCK_EVENT.transactionLogIndex,
      MOCK_EVENT.logType,
      MOCK_EVENT.block,
      MOCK_EVENT.transaction,
      [
        new ethereum.EventParam('id', ethereum.Value.fromBytes(Bytes.fromHexString(REQUEST_ID))),
        new ethereum.EventParam('recipient', ethereum.Value.fromAddress(Address.zero())),
        new ethereum.EventParam('amount', ethereum.Value.fromSignedBigInt(BigInt.fromI32(10))),
      ],
      MOCK_EVENT.receipt,
    )

    handleReceived(requestReceivedEvent)

    const id = `${MOCK_EVENT.transaction.hash.toHex()}-${MOCK_EVENT.logIndex.toString()}`

    assert.entityCount('TokenDistributeRequest', 1)
    assert.fieldEquals('TokenDistributeRequest', REQUEST_ID, 'id', REQUEST_ID)
    assert.fieldEquals('TokenDistributeRequest', REQUEST_ID, 'amount', '90')

    assert.entityCount('CoinMovingHistory', 1)
    assert.fieldEquals('CoinMovingHistory', id, 'id', id)
    assert.fieldEquals('CoinMovingHistory', id, 'amount', '10')
    assert.fieldEquals('CoinMovingHistory', id, 'senderName', 'name')
  })

  test('check handleCancelled', () => {
    const requestCancelledEvent = new RequestCancelled(
      Address.zero(),
      MOCK_EVENT.logIndex,
      MOCK_EVENT.transactionLogIndex,
      MOCK_EVENT.logType,
      MOCK_EVENT.block,
      MOCK_EVENT.transaction,
      [
        new ethereum.EventParam('id', ethereum.Value.fromBytes(Bytes.fromHexString(REQUEST_ID))),
        new ethereum.EventParam('amount', ethereum.Value.fromSignedBigInt(BigInt.fromI32(10))),
      ],
      MOCK_EVENT.receipt,
    )

    handleRequestCancelled(requestCancelledEvent)

    const id = `${MOCK_EVENT.transaction.hash.toHex()}-${MOCK_EVENT.logIndex.toString()}`

    assert.entityCount('TokenDistributeRequest', 1)
    assert.fieldEquals('TokenDistributeRequest', REQUEST_ID, 'id', REQUEST_ID)
    assert.fieldEquals('TokenDistributeRequest', REQUEST_ID, 'amount', '0')
    assert.fieldEquals('TokenDistributeRequest', REQUEST_ID, 'status', 'CANCELLED')

    assert.entityCount('CoinMovingHistory', 1)
    assert.fieldEquals('CoinMovingHistory', id, 'id', id)
    assert.fieldEquals('CoinMovingHistory', id, 'amount', '10')
  })

  test('check handleExpired', () => {
    const requestExpiredEvent = new RequestExpired(
      Address.zero(),
      MOCK_EVENT.logIndex,
      MOCK_EVENT.transactionLogIndex,
      MOCK_EVENT.logType,
      MOCK_EVENT.block,
      MOCK_EVENT.transaction,
      [
        new ethereum.EventParam('id', ethereum.Value.fromBytes(Bytes.fromHexString(REQUEST_ID))),
        new ethereum.EventParam('amount', ethereum.Value.fromSignedBigInt(BigInt.fromI32(10))),
      ],
      MOCK_EVENT.receipt,
    )

    handleRequestExpired(requestExpiredEvent)

    const id = `${MOCK_EVENT.transaction.hash.toHex()}-${MOCK_EVENT.logIndex.toString()}`

    assert.entityCount('TokenDistributeRequest', 1)
    assert.fieldEquals('TokenDistributeRequest', REQUEST_ID, 'id', REQUEST_ID)
    assert.fieldEquals('TokenDistributeRequest', REQUEST_ID, 'amount', '0')
    assert.fieldEquals('TokenDistributeRequest', REQUEST_ID, 'status', 'COMPLETED')

    assert.entityCount('CoinMovingHistory', 1)
    assert.fieldEquals('CoinMovingHistory', id, 'id', id)
    assert.fieldEquals('CoinMovingHistory', id, 'amount', '10')
  })
})
