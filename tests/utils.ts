import { ethereum, BigInt, Address, Bytes } from "@graphprotocol/graph-ts"
import { newMockEvent } from "matchstick-as/assembly/index"
import { Transferred } from "../generated/TransferRequestDispatcher/TransferRequestDispatcher"
import { RequestSubmitted } from "../generated/TransferWithSecretRequestDispatcher/TransferWithSecretRequestDispatcher"

const ZERO_HASH = '0x0000000000000000000000000000000000000000000000000000000000000000'

export function createTransferredEvent(token: Address, from: Address, to: Address, amount: BigInt): Transferred {
  let transferredEvent = changetype<Transferred>(newMockEvent())
  transferredEvent.address = Address.zero()
  transferredEvent.parameters = new Array()

  let tokenParam = new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  let fromParam = new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  let toParam = new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  let amountParam = new ethereum.EventParam("amount", ethereum.Value.fromSignedBigInt(amount))

  let nonceParam = new ethereum.EventParam("nonce", ethereum.Value.fromSignedBigInt(BigInt.zero()))
  let deadlineParam = new ethereum.EventParam("deadline", ethereum.Value.fromSignedBigInt(BigInt.zero()))

  transferredEvent.parameters.push(tokenParam)
  transferredEvent.parameters.push(fromParam)
  transferredEvent.parameters.push(toParam)
  transferredEvent.parameters.push(amountParam)
  transferredEvent.parameters.push(nonceParam)
  transferredEvent.parameters.push(deadlineParam)

  return transferredEvent
}

export function createRequestSubmittedEvent(token: Address, sender: Address, recipient: Address, amount: BigInt): RequestSubmitted {
  let event = changetype<RequestSubmitted>(newMockEvent())

  event.address = Address.zero()
  event.parameters = new Array()

  let idParam = new ethereum.EventParam("id", ethereum.Value.fromBytes(Bytes.fromHexString(ZERO_HASH)))
  let senderParam = new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  let recipientParam = new ethereum.EventParam("recipient", ethereum.Value.fromAddress(recipient))
  let tokenParam = new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  let amountParam = new ethereum.EventParam("amount", ethereum.Value.fromSignedBigInt(amount))
  let metadataParam = new ethereum.EventParam("metadata", ethereum.Value.fromBytes(Bytes.fromHexString(ZERO_HASH)))

  event.parameters.push(idParam)
  event.parameters.push(senderParam)
  event.parameters.push(recipientParam)
  event.parameters.push(tokenParam)
  event.parameters.push(amountParam)
  event.parameters.push(metadataParam)

  return event
}
