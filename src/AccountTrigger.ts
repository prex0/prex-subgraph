import { SharedWalletRegistered, Triggered } from '../generated/AccountTrigger/AccountTrigger'
import { PrexSmartWallet } from '../generated/templates'
import { syncPrexSmartWallet } from './PrexSmartWallet'

export function handleSharedWalletRegistered(event: SharedWalletRegistered): void {
  syncPrexSmartWallet(event.params.account, event.block.timestamp)

  PrexSmartWallet.create(event.params.account)
}

export function handleTriggered(event: Triggered): void {
  syncPrexSmartWallet(event.params.account, event.block.timestamp)
}
