import { Address, BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts'; //
import { assert, describe, newMockEvent, test } from 'matchstick-as';
import { handleOrderFilled } from '../src/SwapExecutorV1';
import { OrderFilled } from '../generated/SwapExecutorV1/SwapExecutorV1';

export const MOCK_EVENT = newMockEvent()

const ORDER_HASH = '0x0000000000000000000000000000000000000000000000000000000000000001'

describe("SwapExecutorV1::handleOrderFilled", () => {
  test('check OrderFilled', () => {

    const tuple = new ethereum.Tuple()
    tuple.push(ethereum.Value.fromAddress(Address.zero()))
    tuple.push(ethereum.Value.fromSignedBigInt(BigInt.fromI32(100)))
    tuple.push(ethereum.Value.fromAddress(Address.zero()))

    const orderHash = new ethereum.EventParam('orderHash', ethereum.Value.fromBytes(Bytes.fromHexString(ORDER_HASH)))

    const orderFilledEvent = new OrderFilled(
      Address.zero(),
      MOCK_EVENT.logIndex,
      MOCK_EVENT.transactionLogIndex,
      MOCK_EVENT.logType,
      MOCK_EVENT.block,
      MOCK_EVENT.transaction,
      [
        orderHash,
        new ethereum.EventParam('swapper', ethereum.Value.fromAddress(Address.zero())),
        new ethereum.EventParam('reactor', ethereum.Value.fromAddress(Address.zero())),
        new ethereum.EventParam('token', ethereum.Value.fromAddress(Address.zero())),
        new ethereum.EventParam('amount', ethereum.Value.fromSignedBigInt(BigInt.fromI32(100))),
        new ethereum.EventParam('outputs', ethereum.Value.fromArray([
          ethereum.Value.fromTuple(
            tuple
          )
        ])),
      ],
      MOCK_EVENT.receipt,
    )

    handleOrderFilled(orderFilledEvent)

    const id = ORDER_HASH

    assert.entityCount('OrderFilledHistory', 1)
    assert.fieldEquals('OrderFilledHistory', id, 'id', id)
    assert.fieldEquals('OrderFilledHistory', id, 'amount', '100')
  })
})
