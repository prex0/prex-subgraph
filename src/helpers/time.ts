import { BigInt } from '@graphprotocol/graph-ts'

/**
 * Get the start timestamp of the given timestamp with the given interval
 * @param timestamp The timestamp to get the start timestamp of
 * @param interval The interval to get the start timestamp of
 * @returns The start timestamp of the given timestamp with the given interval
 */
export function getStartTimestampWithInterval(
  timestamp: BigInt,
  interval: string
): BigInt {
  if (interval === 'HOUR') {
    return getStartTimestamp(timestamp, BigInt.fromU32(3600))
  } else if (interval === 'DAY') {
    return getStartTimestamp(timestamp, BigInt.fromI32(86400))
  }

  return timestamp
}

/**
 * Get the start timestamp of the given timestamp with the given interval
 * @param timestamp The timestamp to get the start timestamp of
 * @param interval The interval to get the start timestamp of
 * @returns The start timestamp of the given timestamp with the given interval
 */
function getStartTimestamp(timestamp: BigInt, interval: BigInt): BigInt {
  const JST_OFFSET = BigInt.fromI32(32400) // JST is UTC+9, which is 9*3600 seconds = 32400 seconds
  const adjustedTimestamp = timestamp.plus(JST_OFFSET)

  const excess = adjustedTimestamp.mod(interval)
  return adjustedTimestamp.minus(excess).minus(JST_OFFSET)
}
