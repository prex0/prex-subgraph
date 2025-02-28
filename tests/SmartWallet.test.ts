import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts';
import { assert, describe, newMockEvent, test } from 'matchstick-as';
import { addOwner, removeOwner } from '../src/PrexSmartWallet';

export const MOCK_EVENT = newMockEvent()
const ADDRESS1 = '0x0000000000000000000000000000000000000001'
const ENCODED_ADDRESS2 = '0x0000000000000000000000000000000000000000000000000000000000000002'

describe("PrexSmartWallet::handleAddOwner", () => {
  test('check AddOwner with P256PublicKey', () => {
    addOwner(Address.fromString(ADDRESS1), MOCK_EVENT.block.timestamp, Bytes.fromHexString('0x' + '0'.repeat(128)), BigInt.fromI32(1))

    const id = Address.fromString(ADDRESS1).toHex()

    assert.entityCount('EndUser', 1)
    assert.fieldEquals('EndUser', id, 'id', id)
    assert.fieldEquals('EndUser', id, 'isSmartWallet', 'true')
    assert.fieldEquals('P256PublicKey', id + '-1', 'id', id + '-1')
    assert.fieldEquals('P256PublicKey', id + '-1', 'publicKey', '0x' + '0'.repeat(128))
  })

  test('check AddOwner with BelongToSharedWallet', () => {
    addOwner(Address.fromString(ADDRESS1), MOCK_EVENT.block.timestamp, Bytes.fromHexString(ENCODED_ADDRESS2), BigInt.fromI32(1))

    const id = Address.fromString(ADDRESS1).toHex()
    const belongToSharedWalletId = id + '-1'

    assert.entityCount('EndUser', 2)
    assert.fieldEquals('EndUser', id, 'id', id)
    assert.fieldEquals('EndUser', id, 'isSmartWallet', 'true')
    assert.fieldEquals('BelongToSharedWallet', belongToSharedWalletId, 'id', belongToSharedWalletId)
    assert.fieldEquals('BelongToSharedWallet', belongToSharedWalletId, 'isRemoved', 'false')
  })
})

describe("PrexSmartWallet::handleRemoveOwner", () => {
  test('check RemoveOwner with P256PublicKey', () => {
    addOwner(Address.fromString(ADDRESS1), MOCK_EVENT.block.timestamp, Bytes.fromHexString('0x' + '0'.repeat(128)), BigInt.fromI32(1))

    removeOwner(Address.fromString(ADDRESS1), BigInt.fromI32(1))

    const id = Address.fromString(ADDRESS1).toHex()

    assert.entityCount('EndUser', 2)
    assert.fieldEquals('EndUser', id, 'id', id)
    assert.fieldEquals('EndUser', id, 'isSmartWallet', 'true')
    assert.fieldEquals('P256PublicKey', id + '-1', 'isRemoved', 'true')
  })

  test('check RemoveOwner with BelongToSharedWallet', () => {
    addOwner(Address.fromString(ADDRESS1), MOCK_EVENT.block.timestamp, Bytes.fromHexString(ENCODED_ADDRESS2), BigInt.fromI32(2))

    removeOwner(Address.fromString(ADDRESS1), BigInt.fromI32(2))

    const id = Address.fromString(ADDRESS1).toHex()
    const belongToSharedWalletId = id + '-2'

    assert.entityCount('EndUser', 2)
    assert.fieldEquals('EndUser', id, 'id', id)
    assert.fieldEquals('EndUser', id, 'isSmartWallet', 'true')
    assert.fieldEquals('BelongToSharedWallet', belongToSharedWalletId, 'id', belongToSharedWalletId)
    assert.fieldEquals('BelongToSharedWallet', belongToSharedWalletId, 'isRemoved', 'true')
  })
})
