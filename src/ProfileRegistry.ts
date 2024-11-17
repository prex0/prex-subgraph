import {
  ProfileImageUpdated,
  ProfileNameUpdated,
  ProfileNameGroupCreated,
  ProfileMetadataUpdated
} from '../generated/ProfileRegistry/ProfileRegistry'
import { ProfileNameGroup } from '../generated/schema'
import { ensureEndUser } from './helpers'

export function handleProfileNameUpdated(event: ProfileNameUpdated): void {
  const user = ensureEndUser(event.params.user, event.block.timestamp)

  user.nameContract = event.params.nameContract.toHex()
  user.name = event.params.name

  user.save()
}

export function handleProfileImageUpdated(event: ProfileImageUpdated): void {
  const user = ensureEndUser(event.params.user, event.block.timestamp)

  user.imageContract = event.params.nftContract
  user.imageTokenId = event.params.tokenId

  user.save()
}

export function handleProfileMetadataUpdated(
  event: ProfileMetadataUpdated
): void {
  const user = ensureEndUser(event.params.user, event.block.timestamp)

  user.metadata = event.params.metadata

  user.save()
}

export function handleProfileNameGroupCreated(
  event: ProfileNameGroupCreated
): void {
  const profileNameGroup = new ProfileNameGroup(
    event.params.nameContract.toHex()
  )

  profileNameGroup.name = event.params.baseName

  profileNameGroup.save()
}
