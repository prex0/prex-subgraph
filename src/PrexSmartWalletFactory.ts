import { PrexSmartWallet } from "../generated/templates";
import { CreateAccountCall } from "../generated/PrexSmartWalletFactory/PrexSmartWalletFactory";

export function handleCreateAccount(event: CreateAccountCall): void {
  PrexSmartWallet.create(event.outputs.account);
}
