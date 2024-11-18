import { WalletCreated } from '../generated/SmartWalletFactoryWrapper/SmartWalletFactoryWrapper'
import { ensureEndUser } from './helpers'

export function handleWalletCreated(event: WalletCreated): void {
  const user = ensureEndUser(event.params.account, event.block.timestamp)

  user.save()
}
