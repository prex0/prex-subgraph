import { WalletCreated } from '../generated/SmartWalletFactoryWrapper/SmartWalletFactoryWrapper'
import { syncPrexSmartWallet } from './PrexSmartWallet'

export function handleWalletCreated(event: WalletCreated): void {
  syncPrexSmartWallet(event.params.account, event.block.timestamp)
}
