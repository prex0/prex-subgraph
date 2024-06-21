import { Address, BigInt } from '@graphprotocol/graph-ts'; //
import { assert, beforeEach, clearStore, describe, test } from 'matchstick-as/assembly/index';
import { createRequestSubmittedEvent } from './utils';
import { handleRequestSubmitted } from '../src/TransferWithSecretRequestDispatcher';

beforeEach(() => {
  clearStore() // <-- clear the store before each test in the file
})

describe("handleRequestSubmitted", () => {
  test('check RequestSubmitted', () => {
    const tradedEvent = createRequestSubmittedEvent(
      Address.zero(),
      Address.zero(),
      Address.zero(),
      BigInt.fromI32(100),
    )

    handleRequestSubmitted(tradedEvent)

    const id = `${tradedEvent.transaction.hash.toHex()}-${tradedEvent.logIndex.toString()}`

    assert.entityCount('TransferHistory', 1)
    assert.fieldEquals('TransferHistory', id, 'id', '1')
    assert.fieldEquals('TransferHistory', id, 'amount', '100')
  })
})
