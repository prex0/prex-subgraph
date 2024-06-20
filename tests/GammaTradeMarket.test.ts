import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts'; //
import { assert, beforeEach, clearStore, describe, test } from 'matchstick-as/assembly/index';
import { createGammaPositionTradedEvent, createGammaPositionModifiedEvent } from './utils';
import { handleGammaPositionTraded, handleGammaPositionModified, getPairIdFromParam, getLeverageFromParam } from '../src/GammaTradeMarket';

beforeEach(() => {
  clearStore() // <-- clear the store before each test in the file
})

describe("handleGammaPositionTraded", () => {
  test('check gamma history item', () => {
    const tradedEvent = createGammaPositionTradedEvent(
      Address.zero(),
      BigInt.fromI32(1),
      BigInt.fromI32(2),
      BigInt.fromI32(100),
      2
    )

    handleGammaPositionTraded(tradedEvent)

    const id = `${tradedEvent.transaction.hash.toHex()}-${tradedEvent.logIndex.toString()}`

    assert.entityCount('GammaTradeHistoryItem', 1)
    assert.fieldEquals('GammaTradeHistoryItem', id, 'pair', '1')
    assert.fieldEquals('GammaTradeHistoryItem', id, 'vault', '2')
    assert.fieldEquals('GammaTradeHistoryItem', id, 'quantity', '100')
    assert.fieldEquals('GammaTradeHistoryItem', id, 'action', 'TRADE')
  })
})

describe("handleGammaPositionModified", () => {
  test('check gamma modified history item', () => {
    const tradedEvent = createGammaPositionModifiedEvent(
      Address.zero(),
      BigInt.fromI32(1),
      BigInt.fromI32(2),
      BigInt.fromI32(100),
    )

    handleGammaPositionModified(tradedEvent)

    const id = `${tradedEvent.transaction.hash.toHex()}-${tradedEvent.logIndex.toString()}`

    assert.entityCount('GammaPositionModifiedHistoryItem', 1)
    assert.fieldEquals('GammaPositionModifiedHistoryItem', id, 'pair', '1')
    assert.fieldEquals('GammaPositionModifiedHistoryItem', id, 'vault', '2')
    assert.fieldEquals('GammaPositionModifiedHistoryItem', id, 'expiration', '100')
  })
})


describe("decode param", () => {
  test('get pairId and leverage', () => {
    const pairId = getPairIdFromParam(
      Bytes.fromHexString('0x0000000000000000000000040000000300000000000000020000000000000001')
    )
    const leverage = getLeverageFromParam(
      Bytes.fromHexString('0x0000000000000000000000040000000300000000000000020000000000000001')
    )

    assert.bigIntEquals(pairId, BigInt.fromI32(2))
    assert.bigIntEquals(leverage, BigInt.fromI32(4))
  })
})
