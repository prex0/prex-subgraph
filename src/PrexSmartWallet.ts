import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { BelongToSharedWallet, P256PublicKey } from "../generated/schema";
import { AddOwner, RemoveOwner } from "../generated/templates/PrexSmartWallet/PrexSmartWallet";
import { ensureEndUser } from "./helpers";

export function handleAddOwner(event: AddOwner): void {
  const user = ensureEndUser(event.address, event.block.timestamp)

  // Only a smart contract wallet can emit the addOwner event
  user.isSmartWallet = true

  if(event.params.owner.byteLength >= 64) {
    const p256PublicKey = ensureP256PublicKey(event.params.owner)

    p256PublicKey.wallet = user.id
    p256PublicKey.index = event.params.index

    p256PublicKey.save()
  } else {
    const ownerAddress = decodeOwnerToAddress(event.params.owner)

    const parentUser = ensureEndUser(
      ownerAddress,
      event.block.timestamp
    )

    const belongToSharedWallet = ensureBelongToSharedWallet(
      // shared wallet address
      event.address,
      // owner address
      ownerAddress,
      // index
      event.params.index
    )

    belongToSharedWallet.save()
    parentUser.save()
  }

  user.save()
}

export function handleRemoveOwner(event: RemoveOwner): void {
  const user = ensureEndUser(event.address, event.block.timestamp)

  if(event.params.owner.byteLength >= 64) {
    const p256PublicKey = ensureP256PublicKey(event.params.owner)

    p256PublicKey.isRemoved = true

    p256PublicKey.save()
  } else {
    const ownerAddress = decodeOwnerToAddress(event.params.owner)

    const belongToSharedWallet = ensureBelongToSharedWallet(
      // shared wallet address
      event.address,
      // owner address
      ownerAddress,
      // index
      event.params.index
    )

    belongToSharedWallet.isRemoved = true

    belongToSharedWallet.save()
  }

  user.save()
}

function decodeOwnerToAddress(owner: Bytes): Address {
  const ownerAddress = Address.fromString(owner.toHexString().slice(26))

  return ownerAddress
}

function getBelongToSharedWalletId(address: Address, owner: Address, index: BigInt): string {
  return address.toHex() + '-' + owner.toHex() + '-' + index.toString()
}

function ensureBelongToSharedWallet(sharedWallet: Address, owner: Address, index: BigInt): BelongToSharedWallet {
  const id = getBelongToSharedWalletId(sharedWallet, owner, index)

  let belongToSharedWallet = BelongToSharedWallet.load(id)

  if(belongToSharedWallet == null) {
    belongToSharedWallet = new BelongToSharedWallet(id)

    belongToSharedWallet.owner = owner.toHex()
    belongToSharedWallet.sharedWallet = sharedWallet.toHex()
    belongToSharedWallet.index = index
    belongToSharedWallet.isRemoved = false
  }

  return belongToSharedWallet
}

function ensureP256PublicKey(owner: Bytes): P256PublicKey {
  const p256PublicKey = P256PublicKey.load(owner.toHex())

  if(p256PublicKey == null) {
    const newP256PublicKey = new P256PublicKey(owner.toHex())

    newP256PublicKey.isRemoved = false


    return newP256PublicKey
  }

  return p256PublicKey
}
