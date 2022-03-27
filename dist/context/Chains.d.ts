/// <reference types="react" />
import { ethers } from 'ethers';
import { ChainConfig } from '../config/chains';
interface IChainsContext {
    areChainsReady: boolean;
    fromChainRpcUrlProvider: undefined | ethers.providers.JsonRpcProvider;
    toChainRpcUrlProvider: undefined | ethers.providers.JsonRpcProvider;
    fromChain: undefined | ChainConfig;
    toChain: undefined | ChainConfig;
    compatibleToChainsForCurrentFromChain: undefined | ChainConfig[];
    changeFromChain: (chain: ChainConfig) => void;
    changeToChain: (chain: ChainConfig) => void;
    switchChains: () => void;
    chainsList: ChainConfig[];
}
declare const ChainsProvider: React.FC<{
    chains: ChainConfig[];
}>;
declare const useChains: () => IChainsContext | null;
export { ChainsProvider, useChains };
//# sourceMappingURL=Chains.d.ts.map