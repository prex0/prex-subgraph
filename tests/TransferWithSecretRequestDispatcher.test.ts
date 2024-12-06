import { Address, BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts'; //
import { assert, createMockedFunction, describe, newMockEvent, test } from 'matchstick-as';
import { RequestSubmitted } from '../generated/TransferWithSecretRequestDispatcher/TransferWithSecretRequestDispatcher';
import { handleRequestSubmitted } from '../src/TransferWithSecretRequestDispatcher';

export const MOCK_EVENT = newMockEvent()

const ZERO_HASH = '0x0000000000000000000000000000000000000000000000000000000000000000'

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

describe("handleRequestSubmitted", () => {
  test('check RequestSubmitted', () => {
    const requestSubmittedEvent = new RequestSubmitted(
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
        new ethereum.EventParam('recipientMetadata', ethereum.Value.fromBytes(Bytes.fromHexString(ZERO_HASH))),
      ],
      MOCK_EVENT.receipt,
    )

    handleRequestSubmitted(requestSubmittedEvent)

    const id = `${MOCK_EVENT.transaction.hash.toHex()}-${MOCK_EVENT.logIndex.toString()}`

    assert.entityCount('TransferWithSecret', 1)
    assert.fieldEquals('TransferWithSecret', id, 'id', id)
    assert.fieldEquals('TransferWithSecret', id, 'amount', '100')


    assert.entityCount('CoinMovingHistory', 1)
    assert.fieldEquals('CoinMovingHistory', id, 'id', id)
    assert.fieldEquals('CoinMovingHistory', id, 'amount', '100')
  })
})
