import { ethereum, BigInt, Address, Bytes, ByteArray } from "@graphprotocol/graph-ts"
import { newMockEvent } from "matchstick-as/assembly/index"
import { PositionUpdated, TokenSupplied, TokenWithdrawn, VaultCreated } from "../generated/PredyPool/PredyPool"
import { PerpTraded } from "../generated/PerpMarket/PerpMarket"
import { SpotTraded } from "../generated/SpotMarket/SpotMarket"
import { GammaPositionModified, GammaPositionTraded } from "../generated/GammaTradeMarket/GammaTradeMarket"

export function createPositionUpdated(vaultId: BigInt, assetId: BigInt, tradeAmount: BigInt, tradeSqrtAmount: BigInt, fee: BigInt): PositionUpdated {
  let positionUpdatedEvent = changetype<PositionUpdated>(newMockEvent())
  positionUpdatedEvent.address = Address.zero()
  positionUpdatedEvent.parameters = new Array()

  let vaultIdParam = new ethereum.EventParam("vaultId", ethereum.Value.fromUnsignedBigInt(vaultId))
  let assetIdParam = new ethereum.EventParam("assetId", ethereum.Value.fromUnsignedBigInt(assetId))
  let tradeAmountParam = new ethereum.EventParam("tradeAmount", ethereum.Value.fromSignedBigInt(tradeAmount))
  let tradeSqrtAmountParam = new ethereum.EventParam("tradeSqrtAmount", ethereum.Value.fromSignedBigInt(tradeSqrtAmount))

  const payoffParamValues = new ethereum.Tuple()
  payoffParamValues.push(ethereum.Value.fromSignedBigInt(BigInt.zero()))
  payoffParamValues.push(ethereum.Value.fromSignedBigInt(BigInt.zero()))
  payoffParamValues.push(ethereum.Value.fromSignedBigInt(BigInt.zero()))
  payoffParamValues.push(ethereum.Value.fromSignedBigInt(BigInt.zero()))
  payoffParamValues.push(ethereum.Value.fromSignedBigInt(BigInt.zero()))

  let payoffParam = new ethereum.EventParam("payoff", ethereum.Value.fromTuple(payoffParamValues))
  let feeParam = new ethereum.EventParam("fee", ethereum.Value.fromSignedBigInt(fee))

  positionUpdatedEvent.parameters.push(vaultIdParam)
  positionUpdatedEvent.parameters.push(assetIdParam)
  positionUpdatedEvent.parameters.push(tradeAmountParam)
  positionUpdatedEvent.parameters.push(tradeSqrtAmountParam)
  positionUpdatedEvent.parameters.push(payoffParam)
  positionUpdatedEvent.parameters.push(feeParam)

  return positionUpdatedEvent
}

export function createTokenSuppliedEvent(assetId: BigInt, suppliedAmount: BigInt): TokenSupplied {
  let tokenSuppliedEvent = changetype<TokenSupplied>(newMockEvent())

  tokenSuppliedEvent.address = Address.zero()

  tokenSuppliedEvent.parameters = new Array()

  let accountParam = new ethereum.EventParam("account", ethereum.Value.fromAddress(Address.zero()))
  let assetIdParam = new ethereum.EventParam("pairId", ethereum.Value.fromUnsignedBigInt(assetId))
  let isQuoteParam = new ethereum.EventParam("isStable", ethereum.Value.fromBoolean(true))
  let suppliedAmountParam = new ethereum.EventParam("suppliedAmount", ethereum.Value.fromUnsignedBigInt(suppliedAmount))

  tokenSuppliedEvent.parameters.push(accountParam)
  tokenSuppliedEvent.parameters.push(assetIdParam)
  tokenSuppliedEvent.parameters.push(isQuoteParam)
  tokenSuppliedEvent.parameters.push(suppliedAmountParam)

  return tokenSuppliedEvent
}

export function createTokenWithdrawnEvent(assetId: BigInt, finalWithdrawnAmount: BigInt): TokenWithdrawn {
  let tokenWithdrawnEvent = changetype<TokenWithdrawn>(newMockEvent())

  tokenWithdrawnEvent.address = Address.zero()

  tokenWithdrawnEvent.parameters = new Array()

  let accountParam = new ethereum.EventParam("account", ethereum.Value.fromAddress(Address.zero()))
  let assetIdParam = new ethereum.EventParam("pairId", ethereum.Value.fromUnsignedBigInt(assetId))
  let isQuoteParam = new ethereum.EventParam("isStable", ethereum.Value.fromBoolean(true))
  let finalWithdrawnAmountParam = new ethereum.EventParam("finalWithdrawnAmount", ethereum.Value.fromUnsignedBigInt(finalWithdrawnAmount))

  tokenWithdrawnEvent.parameters.push(accountParam)
  tokenWithdrawnEvent.parameters.push(assetIdParam)
  tokenWithdrawnEvent.parameters.push(isQuoteParam)
  tokenWithdrawnEvent.parameters.push(finalWithdrawnAmountParam)

  return tokenWithdrawnEvent
}

export function createVaultCreatedEvent(
  vaultId: BigInt,
  owner: Address,
  marginId: Address,
  pairId: BigInt,
): VaultCreated {
  let vaultCreatedEvent = changetype<VaultCreated>(newMockEvent())

  vaultCreatedEvent.address = Address.zero()
  vaultCreatedEvent.parameters = new Array()

  let vaultIdParam = new ethereum.EventParam("vaultId", ethereum.Value.fromUnsignedBigInt(vaultId))
  let ownerParam = new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  let marginIdParam = new ethereum.EventParam("marginId", ethereum.Value.fromAddress(marginId))
  let pairIdParam = new ethereum.EventParam("pairId", ethereum.Value.fromUnsignedBigInt(pairId))

  vaultCreatedEvent.parameters.push(vaultIdParam)
  vaultCreatedEvent.parameters.push(ownerParam)
  vaultCreatedEvent.parameters.push(marginIdParam)
  vaultCreatedEvent.parameters.push(pairIdParam)

  return vaultCreatedEvent
}

export function createPerpTradedEvent(
  trader: Address,
  pairId: BigInt,
  vaultId: BigInt,
  tradeAmount: BigInt,
  fee: BigInt,
  marginAmount: BigInt
): PerpTraded {
  let event = changetype<PerpTraded>(newMockEvent())

  let traderParam = new ethereum.EventParam("trader", ethereum.Value.fromAddress(trader))
  let pairIdParam = new ethereum.EventParam("pairId", ethereum.Value.fromUnsignedBigInt(pairId))
  let vaultIdParam = new ethereum.EventParam("vaultId", ethereum.Value.fromUnsignedBigInt(vaultId))
  let tradeAmountParam = new ethereum.EventParam("tradeAmount", ethereum.Value.fromSignedBigInt(tradeAmount))

  // Makes Payoff struct
  const payoffParamValues = new ethereum.Tuple()
  payoffParamValues.push(ethereum.Value.fromSignedBigInt(BigInt.zero()))
  payoffParamValues.push(ethereum.Value.fromSignedBigInt(BigInt.zero()))
  payoffParamValues.push(ethereum.Value.fromSignedBigInt(BigInt.zero()))
  payoffParamValues.push(ethereum.Value.fromSignedBigInt(BigInt.zero()))
  payoffParamValues.push(ethereum.Value.fromSignedBigInt(BigInt.zero()))
  payoffParamValues.push(ethereum.Value.fromSignedBigInt(BigInt.zero()))

  let payoffParam = new ethereum.EventParam("payoff", ethereum.Value.fromTuple(payoffParamValues))
  let feeParam = new ethereum.EventParam("fee", ethereum.Value.fromSignedBigInt(fee))
  let marginAmountParam = new ethereum.EventParam("marginAmount", ethereum.Value.fromSignedBigInt(marginAmount))

  event.parameters.push(traderParam)
  event.parameters.push(pairIdParam)
  event.parameters.push(vaultIdParam)
  event.parameters.push(tradeAmountParam)
  event.parameters.push(payoffParam)
  event.parameters.push(feeParam)
  event.parameters.push(marginAmountParam)

  return event
}

export function createSpotTradedEvent(
  trader: Address,
  filler: Address,
  baseToken: Address,
  quoteToken: Address,
  baseAmount: BigInt,
  quoteAmount: BigInt,
  validatorAddress: Address
): SpotTraded {
  let event = changetype<SpotTraded>(newMockEvent())

  let traderParam = new ethereum.EventParam("trader", ethereum.Value.fromAddress(trader))
  let fillerParam = new ethereum.EventParam("filler", ethereum.Value.fromAddress(filler))
  let baseTokenParam = new ethereum.EventParam("baseToken", ethereum.Value.fromAddress(baseToken))
  let quoteTokenParam = new ethereum.EventParam("quoteToken", ethereum.Value.fromAddress(quoteToken))
  let baseAmountParam = new ethereum.EventParam("baseAmount", ethereum.Value.fromUnsignedBigInt(baseAmount))
  let quoteAmountParam = new ethereum.EventParam("quoteAmount", ethereum.Value.fromUnsignedBigInt(quoteAmount))
  let validatorAddressParam = new ethereum.EventParam("validatorAddress", ethereum.Value.fromAddress(validatorAddress))

  event.parameters.push(traderParam)
  event.parameters.push(fillerParam)
  event.parameters.push(baseTokenParam)
  event.parameters.push(quoteTokenParam)
  event.parameters.push(baseAmountParam)
  event.parameters.push(quoteAmountParam)
  event.parameters.push(validatorAddressParam)

  return event
}

export function createGammaPositionTradedEvent(
  trader: Address,
  pairId: BigInt,
  positionId: BigInt,
  quantity: BigInt,
  callbackType: i32
): GammaPositionTraded {
  let event = changetype<GammaPositionTraded>(newMockEvent())

  let traderParam = new ethereum.EventParam("trader", ethereum.Value.fromAddress(trader))
  let pairIdParam = new ethereum.EventParam("pairId", ethereum.Value.fromUnsignedBigInt(pairId))
  let positionIdParam = new ethereum.EventParam("positionId", ethereum.Value.fromUnsignedBigInt(positionId))
  let quantityParam = new ethereum.EventParam("quantity", ethereum.Value.fromSignedBigInt(quantity))
  let quantitySqrtParam = new ethereum.EventParam("quantitySqrt", ethereum.Value.fromSignedBigInt(BigInt.zero()))

  event.parameters.push(traderParam)
  event.parameters.push(pairIdParam)
  event.parameters.push(positionIdParam)
  event.parameters.push(quantityParam)
  event.parameters.push(quantitySqrtParam)

  // Makes Payoff struct
  const payoffParamValues = new ethereum.Tuple()
  payoffParamValues.push(ethereum.Value.fromSignedBigInt(BigInt.zero()))
  payoffParamValues.push(ethereum.Value.fromSignedBigInt(BigInt.zero()))
  payoffParamValues.push(ethereum.Value.fromSignedBigInt(BigInt.zero()))
  payoffParamValues.push(ethereum.Value.fromSignedBigInt(BigInt.zero()))
  payoffParamValues.push(ethereum.Value.fromSignedBigInt(BigInt.zero()))
  payoffParamValues.push(ethereum.Value.fromSignedBigInt(BigInt.zero()))

  let payoffParam = new ethereum.EventParam("payoff", ethereum.Value.fromTuple(payoffParamValues))
  let feeParam = new ethereum.EventParam("fee", ethereum.Value.fromSignedBigInt(BigInt.zero()))
  let marginAmountParam = new ethereum.EventParam("marginAmount", ethereum.Value.fromSignedBigInt(BigInt.zero()))
  let callbackTypeParam = new ethereum.EventParam("callbackType", ethereum.Value.fromI32(callbackType))

  event.parameters.push(payoffParam)
  event.parameters.push(feeParam)
  event.parameters.push(marginAmountParam)
  event.parameters.push(callbackTypeParam)

  return event
}

export function createGammaPositionModifiedEvent(
  trader: Address,
  pairId: BigInt,
  positionId: BigInt,
  expiration: BigInt,
): GammaPositionModified {
  let event = changetype<GammaPositionModified>(newMockEvent())

  let traderParam = new ethereum.EventParam("trader", ethereum.Value.fromAddress(trader))
  let pairIdParam = new ethereum.EventParam("pairId", ethereum.Value.fromUnsignedBigInt(pairId))
  let positionIdParam = new ethereum.EventParam("positionId", ethereum.Value.fromUnsignedBigInt(positionId))

  event.parameters.push(traderParam)
  event.parameters.push(pairIdParam)
  event.parameters.push(positionIdParam)

  // Makes Modify Info struct
  const modifyInfoParamValues = new ethereum.Tuple()
  modifyInfoParamValues.push(ethereum.Value.fromBoolean(true))
  modifyInfoParamValues.push(ethereum.Value.fromSignedBigInt(expiration))
  modifyInfoParamValues.push(ethereum.Value.fromSignedBigInt(BigInt.zero()))
  modifyInfoParamValues.push(ethereum.Value.fromSignedBigInt(BigInt.zero()))
  modifyInfoParamValues.push(ethereum.Value.fromSignedBigInt(BigInt.zero()))
  modifyInfoParamValues.push(ethereum.Value.fromSignedBigInt(BigInt.zero()))
  modifyInfoParamValues.push(ethereum.Value.fromSignedBigInt(BigInt.zero()))
  modifyInfoParamValues.push(ethereum.Value.fromSignedBigInt(BigInt.zero()))
  modifyInfoParamValues.push(ethereum.Value.fromI32(0))
  modifyInfoParamValues.push(ethereum.Value.fromSignedBigInt(BigInt.zero()))

  let modifyInfoParam = new ethereum.EventParam("modifyInfo", ethereum.Value.fromTuple(modifyInfoParamValues))

  event.parameters.push(modifyInfoParam)

  return event
}
