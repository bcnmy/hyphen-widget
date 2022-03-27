/// <reference types="react" />
import { ethers } from "ethers";
import Web3Modal from "web3modal";
interface IWalletProviderContext {
    walletProvider: ethers.providers.Web3Provider | undefined;
    signer: ethers.Signer | undefined;
    web3Modal: Web3Modal | undefined;
    connect: Web3Modal["connect"];
    disconnect: Web3Modal["clearCachedProvider"];
    accounts: string[] | undefined;
    currentChainId: number | undefined;
    isLoggedIn: boolean;
    rawEthereumProvider: undefined | any;
}
declare const WalletProviderProvider: React.FC;
declare const useWalletProvider: () => IWalletProviderContext | null;
export { WalletProviderProvider, useWalletProvider };
//# sourceMappingURL=WalletProvider.d.ts.map