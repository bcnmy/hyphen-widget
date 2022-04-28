export declare type TokenConfig = {
    symbol: string;
    image?: string;
    coinGeckoId?: string;
    [chainId: number]: {
        address: string;
        transferOverhead: number;
        decimal: number;
        symbol: string;
        fixedDecimalPoint?: number;
        chainColor: string;
        isSupported?: boolean;
    };
};
export declare const tokens: TokenConfig[];
export default tokens;
//# sourceMappingURL=index.d.ts.map