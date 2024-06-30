import { Address, BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts'; //
import { assert, describe, newMockEvent, test } from 'matchstick-as';
import { Transferred } from '../generated/TransferRequestDispatcher/TransferRequestDispatcher';
import { handleTransferred } from '../src/TransferRequestDispatcher';

export const MOCK_EVENT = newMockEvent()

const ZERO_HASH = '0x0000000000000000000000000000000000000000000000000000000000000000'

describe("handleTransferred", () => {
  test('check Transferred', () => {
    const requestSubmittedEvent = new Transferred(
      Address.zero(),
      MOCK_EVENT.logIndex,
      MOCK_EVENT.transactionLogIndex,
      MOCK_EVENT.logType,
      MOCK_EVENT.block,
      MOCK_EVENT.transaction,
      [
        new ethereum.EventParam('token', ethereum.Value.fromAddress(Address.zero())),
        new ethereum.EventParam('from', ethereum.Value.fromAddress(Address.zero())),
        new ethereum.EventParam('to', ethereum.Value.fromAddress(Address.zero())),
        new ethereum.EventParam('amount', ethereum.Value.fromSignedBigInt(BigInt.fromI32(100))),
        new ethereum.EventParam('metadata', ethereum.Value.fromBytes(Bytes.fromHexString(ZERO_HASH))),
      ],
      MOCK_EVENT.receipt,
    )

    handleTransferred(requestSubmittedEvent)

    const id = `${MOCK_EVENT.transaction.hash.toHex()}-${MOCK_EVENT.logIndex.toString()}`

    assert.entityCount('TransferRequest', 1)
    assert.fieldEquals('TransferRequest', id, 'id', id)
    assert.fieldEquals('TransferRequest', id, 'amount', '100')


    assert.entityCount('CoinMovingHistory', 1)
    assert.fieldEquals('CoinMovingHistory', id, 'id', id)
    assert.fieldEquals('CoinMovingHistory', id, 'amount', '100')
  })
})
