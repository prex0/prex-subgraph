import { Address, BigInt } from '@graphprotocol/graph-ts'; //
import { assert, beforeEach, clearStore, describe, test } from 'matchstick-as/assembly/index';
import { createTransferredEvent } from './utils';
import { handleTransferred } from '../src/TransferRequestDispatcher';

beforeEach(() => {
  clearStore() // <-- clear the store before each test in the file
})

describe("handleTransferred", () => {
  test('1 + 1 = 2', () => {
    assert.fieldEquals('TransferHistory', '1', 'id', '1')
    assert.fieldEquals('TransferHistory', '1', 'amount', '100')
  })

  test('check transferred', () => {
    const tradedEvent = createTransferredEvent(
      Address.zero(),
      Address.zero(),
      Address.zero(),
      BigInt.fromI32(100),
    )

    handleTransferred(tradedEvent)

    const id = `${tradedEvent.transaction.hash.toHex()}-${tradedEvent.logIndex.toString()}`

    assert.entityCount('TransferHistory', 1)
    assert.fieldEquals('TransferHistory', id, 'id', '1')
    assert.fieldEquals('TransferHistory', id, 'amount', '100')
  })
})
