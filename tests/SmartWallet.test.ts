import { Address, BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts';
import { assert, describe, newMockEvent, test } from 'matchstick-as';
import { handleAddOwner, handleRemoveOwner } from '../src/PrexSmartWallet';
import { AddOwner, RemoveOwner } from '../generated/templates/PrexSmartWallet/PrexSmartWallet';

export const MOCK_EVENT = newMockEvent()
const ADDRESS1 = '0x0000000000000000000000000000000000000001'
const ADDRESS2 = '0x0000000000000000000000000000000000000002'
const ENCODED_ADDRESS2 = '0x0000000000000000000000000000000000000000000000000000000000000002'

describe("PrexSmartWallet::handleAddOwner", () => {
  test('check AddOwner with P256PublicKey', () => {
    const addOwnerEvent = new AddOwner(
      Address.fromString(ADDRESS1),
      MOCK_EVENT.logIndex,
      MOCK_EVENT.transactionLogIndex,
      MOCK_EVENT.logType,
      MOCK_EVENT.block,
      MOCK_EVENT.transaction,
      [
        new ethereum.EventParam('index', ethereum.Value.fromSignedBigInt(BigInt.fromI32(1))),
        new ethereum.EventParam('owner', ethereum.Value.fromBytes(Bytes.fromHexString('0x' + '0'.repeat(128)))),
      ],
      MOCK_EVENT.receipt,
    )

    handleAddOwner(addOwnerEvent)

    const id = Address.fromString(ADDRESS1).toHex()

    assert.entityCount('EndUser', 1)
    assert.fieldEquals('EndUser', id, 'id', id)
    assert.fieldEquals('EndUser', id, 'isSmartWallet', 'true')
    assert.fieldEquals('P256PublicKey', '0x' + '0'.repeat(128), 'id', '0x' + '0'.repeat(128))
  })

  test('check AddOwner with BelongToSharedWallet', () => {
    const addOwnerEvent = new AddOwner(
      Address.fromString(ADDRESS1),
      MOCK_EVENT.logIndex,
      MOCK_EVENT.transactionLogIndex,
      MOCK_EVENT.logType,
      MOCK_EVENT.block,
      MOCK_EVENT.transaction,
      [
        new ethereum.EventParam('index', ethereum.Value.fromSignedBigInt(BigInt.fromI32(1))),
        new ethereum.EventParam('owner', ethereum.Value.fromBytes(Bytes.fromHexString(ENCODED_ADDRESS2))),
      ],
      MOCK_EVENT.receipt,
    )

    handleAddOwner(addOwnerEvent)

    const id = Address.fromString(ADDRESS1).toHex()
    const belongToSharedWalletId = id + '-' + Address.fromString(ADDRESS2).toHex() + '-1'

    assert.entityCount('EndUser', 2)
    assert.fieldEquals('EndUser', id, 'id', id)
    assert.fieldEquals('EndUser', id, 'isSmartWallet', 'true')
    assert.fieldEquals('BelongToSharedWallet', belongToSharedWalletId, 'id', belongToSharedWalletId)
    assert.fieldEquals('BelongToSharedWallet', belongToSharedWalletId, 'isRemoved', 'false')
  })
})

describe("PrexSmartWallet::handleRemoveOwner", () => {
  test('check RemoveOwner with P256PublicKey', () => {
    const addOwnerEvent = new AddOwner(
      Address.fromString(ADDRESS1),
      MOCK_EVENT.logIndex,
      MOCK_EVENT.transactionLogIndex,
      MOCK_EVENT.logType,
      MOCK_EVENT.block,
      MOCK_EVENT.transaction,
      [
        new ethereum.EventParam('index', ethereum.Value.fromSignedBigInt(BigInt.fromI32(1))),
        new ethereum.EventParam('owner', ethereum.Value.fromBytes(Bytes.fromHexString('0x' + '0'.repeat(128)))),
      ],
      MOCK_EVENT.receipt,
    )

    handleAddOwner(addOwnerEvent)

    const removeOwnerEvent = new RemoveOwner(
      Address.fromString(ADDRESS1),
      MOCK_EVENT.logIndex,
      MOCK_EVENT.transactionLogIndex,
      MOCK_EVENT.logType,
      MOCK_EVENT.block,
      MOCK_EVENT.transaction,
      [
        new ethereum.EventParam('index', ethereum.Value.fromSignedBigInt(BigInt.fromI32(1))),
        new ethereum.EventParam('owner', ethereum.Value.fromBytes(Bytes.fromHexString('0x' + '0'.repeat(128)))),
      ],
      MOCK_EVENT.receipt,
    )

    handleRemoveOwner(removeOwnerEvent)

    const id = Address.fromString(ADDRESS1).toHex()

    assert.entityCount('EndUser', 2)
    assert.fieldEquals('EndUser', id, 'id', id)
    assert.fieldEquals('EndUser', id, 'isSmartWallet', 'true')
    assert.fieldEquals('P256PublicKey', '0x' + '0'.repeat(128), 'isRemoved', 'true')
  })

  test('check RemoveOwner with BelongToSharedWallet', () => {
    const addOwnerEvent = new AddOwner(
      Address.fromString(ADDRESS1),
      MOCK_EVENT.logIndex,
      MOCK_EVENT.transactionLogIndex,
      MOCK_EVENT.logType,
      MOCK_EVENT.block,
      MOCK_EVENT.transaction,
      [
        new ethereum.EventParam('index', ethereum.Value.fromSignedBigInt(BigInt.fromI32(1))),
        new ethereum.EventParam('owner', ethereum.Value.fromBytes(Bytes.fromHexString(ENCODED_ADDRESS2))),
      ],
      MOCK_EVENT.receipt,
    )

    handleAddOwner(addOwnerEvent)

    const removeOwnerEvent = new RemoveOwner(
      Address.fromString(ADDRESS1),
      MOCK_EVENT.logIndex,
      MOCK_EVENT.transactionLogIndex,
      MOCK_EVENT.logType,
      MOCK_EVENT.block,
      MOCK_EVENT.transaction,
      [
        new ethereum.EventParam('index', ethereum.Value.fromSignedBigInt(BigInt.fromI32(1))),
        new ethereum.EventParam('owner', ethereum.Value.fromBytes(Bytes.fromHexString(ENCODED_ADDRESS2))),
      ],
      MOCK_EVENT.receipt,
    )

    handleRemoveOwner(removeOwnerEvent)

    const id = Address.fromString(ADDRESS1).toHex()
    const belongToSharedWalletId = id + '-' + Address.fromString(ADDRESS2).toHex() + '-1'

    assert.entityCount('EndUser', 2)
    assert.fieldEquals('EndUser', id, 'id', id)
    assert.fieldEquals('EndUser', id, 'isSmartWallet', 'true')
    assert.fieldEquals('BelongToSharedWallet', belongToSharedWalletId, 'id', belongToSharedWalletId)
    assert.fieldEquals('BelongToSharedWallet', belongToSharedWalletId, 'isRemoved', 'true')
  })
})
