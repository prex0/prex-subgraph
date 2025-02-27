import { BigInt } from '@graphprotocol/graph-ts'

const TOTAL_SUPPLY = BigInt.fromI32(100000000)
const K = BigInt.fromI32(800).times(TOTAL_SUPPLY)

export function calculatePrice(marketCap: BigInt): BigInt {
  return marketCap.times(marketCap).div(K)
}
