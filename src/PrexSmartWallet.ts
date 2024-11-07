import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { BelongToSharedWallet, P256PublicKey } from "../generated/schema";
import { AddOwner, RemoveOwner } from "../generated/templates/PrexSmartWallet/PrexSmartWallet";
import { ensureEndUser } from "./helpers";

export function handleAddOwner(event: AddOwner): void {
  const user = ensureEndUser(event.address, event.block.timestamp)

  user.isSmartWallet = true

  if(event.params.owner.byteLength >= 64) {
    const p256PublicKey = ensureP256PublicKey(event.params.owner)

    p256PublicKey.wallet = user.id
    p256PublicKey.index = event.params.index

    p256PublicKey.save()
  } else {
    const parentUser = ensureEndUser(
      Address.fromBytes(event.params.owner),
      event.block.timestamp
    )

    const id = getBelongToSharedWalletId(
      event.address,
      Address.fromBytes(event.params.owner),
      event.params.index
    )

    const belongToSharedWallet = new BelongToSharedWallet(id)

    belongToSharedWallet.owner = parentUser.id
    belongToSharedWallet.sharedWallet = user.id
    belongToSharedWallet.index = event.params.index
    belongToSharedWallet.isRemoved = false;

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
    const id = getBelongToSharedWalletId(
      event.address,
      Address.fromBytes(event.params.owner),
      event.params.index
    )

    const belongToSharedWallet = BelongToSharedWallet.load(id)

    if(belongToSharedWallet == null) {
      return
    }

    belongToSharedWallet.isRemoved = true

    belongToSharedWallet.save()
  }

  user.save()
}

function getBelongToSharedWalletId(address: Address, owner: Address, index: BigInt): string {
  return address.toHex() + '-' + owner.toHex() + '-' + index.toString()
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
