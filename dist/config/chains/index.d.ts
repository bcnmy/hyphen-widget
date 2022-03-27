import { chainMap } from './chainMap';
export declare type Chains = 'Avalanche' | 'Ethereum' | 'Fuji' | 'Goerli' | 'Polygon' | 'Mumbai' | 'Rinkeby';
export declare type ChainConfig = {
    name: Chains;
    image?: string;
    subText: string;
    chainId: number;
    rpcUrl: string;
    currency: string;
    nativeDecimal: number;
    nativeToken: string;
    nativeFaucetURL: string;
    biconomy: {
        enable: boolean;
        apiKey: string;
    };
    assetSentTopicId: string;
    networkAgnosticTransfer: boolean;
    graphURL: string;
    explorerUrl: string;
};
export declare const chains: ChainConfig[];
export { chainMap };
//# sourceMappingURL=index.d.ts.map