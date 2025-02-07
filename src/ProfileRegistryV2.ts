import {
  NameUpdated,
  AvatarUpdated,
  MetadataUpdated
} from '../generated/ProfileRegistryV2/ProfileRegistryV2'
import { ensureEndUser } from './helpers'

export function handleNameUpdated(event: NameUpdated): void {
  const user = ensureEndUser(event.params.user, event.block.timestamp)

  user.domain = event.params.domain
  user.name = event.params.name

  user.save()
}

export function handleAvatarUpdated(event: AvatarUpdated): void {
  const user = ensureEndUser(event.params.user, event.block.timestamp)

  user.pictureHash = event.params.pictureHash

  user.save()
}

export function handleMetadataUpdated(event: MetadataUpdated): void {
  const user = ensureEndUser(event.params.user, event.block.timestamp)

  user.metadata = event.params.metadata

  user.save()
}
