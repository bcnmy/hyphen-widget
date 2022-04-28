import { chainMap } from "./chainMap";
export declare type ChainConfig = {
    name: Chains;
    image?: string;
    subText: string;
    chainId: number;
    chainColor: string;
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
    v2GraphURL?: string;
    explorerUrl: string;
};
export declare let chains: ChainConfig[];
export { chainMap };
export declare type Chains = "Avalanche" | "Ethereum" | "Fuji" | "Goerli" | "Polygon" | "Mumbai" | "Rinkeby";
//# sourceMappingURL=index.d.ts.map