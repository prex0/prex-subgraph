import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts'
import { BelongToSharedWallet, P256PublicKey } from '../generated/schema'
import {
  PrexSmartWallet
} from '../generated/templates/PrexSmartWallet/PrexSmartWallet'
import { AddOwner, RemoveOwner } from '../generated/templates/PrexSmartWallet/PrexSmartWallet'
import { ensureEndUser, saveEndUserIfNotExists } from './helpers'

export function handleAddOwner(event: AddOwner): void {
  syncPrexSmartWallet(event.address, event.block.timestamp)
}

export function handleRemoveOwner(event: RemoveOwner): void {
  syncPrexSmartWallet(event.address, event.block.timestamp)
}

export function syncPrexSmartWalletWithBytes(address: Bytes, timestamp: BigInt): void {
  syncPrexSmartWallet(Address.fromString(address.toHexString()), timestamp)
}

export function syncPrexSmartWallet(address: Address, timestamp: BigInt): void {
  const contract = PrexSmartWallet.bind(address)

  const ownerCount = contract.try_nextOwnerIndex()

  if (ownerCount.reverted) {
    return
  }

  for(let i = 0; i < ownerCount.value.toI32(); i++) {
    const owner = contract.try_ownerAtIndex(BigInt.fromI32(i))

    if (owner.reverted) {
      continue
    }

    if (owner.value.byteLength > 0) {
      addOwner(address, timestamp, owner.value, BigInt.fromI32(i))
    } else {
      removeOwner(address, owner.value, BigInt.fromI32(i))
    }
  }
}

export function addOwner(address: Address, timestamp: BigInt, owner: Bytes, index: BigInt): void {
  const user = ensureEndUser(address, timestamp)

  if (owner.byteLength >= 64) {
    saveP256PublicKey(user.id, index, owner)
  } else {
    const ownerAddress = decodeOwnerToAddress(owner)

    // save the owner if not exists
    saveEndUserIfNotExists(ownerAddress, timestamp)
    
    saveBelongToSharedWallet(
      // shared wallet address
      address,
      // owner address
      ownerAddress,
      // index
      index
    )
  }

  // Only a smart contract wallet can emit the addOwner event
  if (!user.isSmartWallet) {
    user.isSmartWallet = true
    user.save()
  }
}

export function removeOwner(address: Address, owner: Bytes, index: BigInt): void {
  if (owner.byteLength >= 64) {
    removeP256PublicKey(address.toHex(), index)
  } else {
    const ownerAddress = decodeOwnerToAddress(owner)

    const belongToSharedWallet = ensureBelongToSharedWallet(
      // shared wallet address
      address,
      // owner address
      ownerAddress,
      // index
      index
    )

    if (!belongToSharedWallet.isRemoved) {
      belongToSharedWallet.isRemoved = true
      belongToSharedWallet.save()
    }
  }
}


function decodeOwnerToAddress(owner: Bytes): Address {
  const ownerAddress = Address.fromString(owner.toHexString().slice(26))

  return ownerAddress
}

function getBelongToSharedWalletId(
  address: Address,
  index: BigInt
): string {
  return address.toHex() + '-' + index.toString()
}

function ensureBelongToSharedWallet(
  sharedWallet: Address,
  owner: Address,
  index: BigInt
): BelongToSharedWallet {
  const id = getBelongToSharedWalletId(sharedWallet, index)

  let belongToSharedWallet = BelongToSharedWallet.load(id)

  if (belongToSharedWallet == null) {
    belongToSharedWallet = new BelongToSharedWallet(id)

    belongToSharedWallet.owner = owner.toHex()
    belongToSharedWallet.sharedWallet = sharedWallet.toHex()
    belongToSharedWallet.index = index
    belongToSharedWallet.isRemoved = false
  }

  return belongToSharedWallet
}

function saveBelongToSharedWallet(sharedWallet: Address, owner: Address, index: BigInt): void {
  const id = getBelongToSharedWalletId(sharedWallet, index)

  let belongToSharedWallet = BelongToSharedWallet.load(id)

  if (belongToSharedWallet == null) {
    belongToSharedWallet = new BelongToSharedWallet(id)

    belongToSharedWallet.owner = owner.toHex()
    belongToSharedWallet.sharedWallet = sharedWallet.toHex()
    belongToSharedWallet.index = index
    belongToSharedWallet.isRemoved = false

    belongToSharedWallet.save()
  }
}

function saveP256PublicKey(walletId: string, index: BigInt, owner: Bytes): void {
  const id = getP256PublicKeyId(walletId, index)

  const p256PublicKey = P256PublicKey.load(id)

  if (p256PublicKey == null) {
    const newP256PublicKey = new P256PublicKey(id)

    newP256PublicKey.isRemoved = false
    newP256PublicKey.wallet = walletId
    newP256PublicKey.index = index
    newP256PublicKey.publicKey = owner

    newP256PublicKey.save()
  }
}

function removeP256PublicKey(walletId: string, index: BigInt): void {
  const id = getP256PublicKeyId(walletId, index)

  const p256PublicKey = P256PublicKey.load(id)

  if (p256PublicKey != null && !p256PublicKey.isRemoved) {
    p256PublicKey.isRemoved = true

    p256PublicKey.save()
  }
}

function getP256PublicKeyId(walletId: string, index: BigInt): string {
  return walletId + '-' + index.toString()
}
