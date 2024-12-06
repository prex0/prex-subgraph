import { Address, BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts'; //
import { assert, createMockedFunction, describe, newMockEvent, test } from 'matchstick-as';
import { handleRequestSubmitted, handleRequestCompleted, handleRequestCancelled } from '../src/OnetimeLockRequestDispatcher';
import { RequestCompleted, RequestSubmitted, RequestCancelled } from '../generated/OnetimeLockRequestDispatcherV2/OnetimeLockRequestDispatcher';

export const MOCK_EVENT = newMockEvent()

const ZERO_HASH = '0x0000000000000000000000000000000000000000000000000000000000000000'
const ID2 = '0x0000000000000000000000000000000000000000000000000000000000000002'

createMockedFunction(Address.zero(), "totalSupply", "totalSupply():(uint256)")
  .returns([
    ethereum.Value.fromI32(0)
  ]);

createMockedFunction(Address.zero(), "balanceOf", "balanceOf(address):(uint256)")
  .withArgs([
    ethereum.Value.fromAddress(Address.zero())
  ])
  .returns([
    ethereum.Value.fromI32(0)
  ]);

describe("OnetimeLockRequestDispatcher::handleRequestSubmitted", () => {
  test('check RequestSubmitted', () => {
    const requestSubmittedEvent = new RequestSubmitted(
      Address.zero(),
      MOCK_EVENT.logIndex,
      MOCK_EVENT.transactionLogIndex,
      MOCK_EVENT.logType,
      MOCK_EVENT.block,
      MOCK_EVENT.transaction,
      [
        new ethereum.EventParam('id', ethereum.Value.fromBytes(Bytes.fromHexString(ZERO_HASH))),
        new ethereum.EventParam('token', ethereum.Value.fromAddress(Address.zero())),
        new ethereum.EventParam('from', ethereum.Value.fromAddress(Address.zero())),
        new ethereum.EventParam('amount', ethereum.Value.fromSignedBigInt(BigInt.fromI32(100))),
        new ethereum.EventParam('expiry', ethereum.Value.fromSignedBigInt(BigInt.fromI32(200))),
        new ethereum.EventParam('metadata', ethereum.Value.fromBytes(Bytes.fromHexString(ZERO_HASH)))
      ],
      MOCK_EVENT.receipt,
    )

    handleRequestSubmitted(requestSubmittedEvent)

    const id = ZERO_HASH

    assert.entityCount('OnetimeLock', 1)
    assert.fieldEquals('OnetimeLock', id, 'id', id)
    assert.fieldEquals('OnetimeLock', id, 'amount', '100')

    assert.entityCount('CoinMovingHistory', 0)

    const requestCompletedEvent = new RequestCompleted(
      Address.zero(),
      MOCK_EVENT.logIndex,
      MOCK_EVENT.transactionLogIndex,
      MOCK_EVENT.logType,
      MOCK_EVENT.block,
      MOCK_EVENT.transaction,
      [
        new ethereum.EventParam('id', ethereum.Value.fromBytes(Bytes.fromHexString(ZERO_HASH))),
        new ethereum.EventParam('recipient', ethereum.Value.fromAddress(Address.zero())),
        new ethereum.EventParam('metadata', ethereum.Value.fromBytes(Bytes.fromHexString(ZERO_HASH)))
      ],
      MOCK_EVENT.receipt,
    )

    handleRequestCompleted(requestCompletedEvent)

    assert.fieldEquals('OnetimeLock', id, 'status', 'COMPLETED')

    const coinMovingId = `${MOCK_EVENT.transaction.hash.toHex()}-${MOCK_EVENT.logIndex.toString()}`

    assert.entityCount('CoinMovingHistory', 1)
    assert.fieldEquals('CoinMovingHistory', coinMovingId, 'id', coinMovingId)
    assert.fieldEquals('CoinMovingHistory', coinMovingId, 'amount', '100')

  })

  test('check RequestCancelled', () => {
    const requestSubmittedEvent = new RequestSubmitted(
      Address.zero(),
      MOCK_EVENT.logIndex,
      MOCK_EVENT.transactionLogIndex,
      MOCK_EVENT.logType,
      MOCK_EVENT.block,
      MOCK_EVENT.transaction,
      [
        new ethereum.EventParam('id', ethereum.Value.fromBytes(Bytes.fromHexString(ID2))),
        new ethereum.EventParam('token', ethereum.Value.fromAddress(Address.zero())),
        new ethereum.EventParam('from', ethereum.Value.fromAddress(Address.zero())),
        new ethereum.EventParam('amount', ethereum.Value.fromSignedBigInt(BigInt.fromI32(100))),
        new ethereum.EventParam('expiry', ethereum.Value.fromSignedBigInt(BigInt.fromI32(200))),
        new ethereum.EventParam('metadata', ethereum.Value.fromBytes(Bytes.fromHexString(ZERO_HASH)))
      ],
      MOCK_EVENT.receipt,
    )

    assert.entityCount('OnetimeLock', 1)

    handleRequestSubmitted(requestSubmittedEvent)

    const id = ID2

    assert.entityCount('OnetimeLock', 2)
    assert.fieldEquals('OnetimeLock', id, 'id', id)
    assert.fieldEquals('OnetimeLock', id, 'amount', '100')

    assert.entityCount('CoinMovingHistory', 1)

    const requestCancelledEvent = new RequestCancelled(
      Address.zero(),
      MOCK_EVENT.logIndex,
      MOCK_EVENT.transactionLogIndex,
      MOCK_EVENT.logType,
      MOCK_EVENT.block,
      MOCK_EVENT.transaction,
      [
        new ethereum.EventParam('id', ethereum.Value.fromBytes(Bytes.fromHexString(ID2)))
      ],
      MOCK_EVENT.receipt,
    )

    handleRequestCancelled(requestCancelledEvent)

    assert.entityCount('CoinMovingHistory', 1)

    assert.fieldEquals('OnetimeLock', id, 'status', 'CANCELLED')
  })
})
