import { BigInt } from '@graphprotocol/graph-ts'

const TOTAL_SUPPLY = BigInt.fromI32(100000000)
const K = BigInt.fromI32(800).times(TOTAL_SUPPLY)

const SCALE = BigInt.fromString('1000000000000000000')

export function calculatePrice(marketCap: BigInt): BigInt {
  return marketCap.times(marketCap).times(SCALE).div(K)
}
