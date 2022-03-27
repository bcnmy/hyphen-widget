export declare type TokenConfig = {
    symbol: string;
    image?: string;
    [chainId: number]: {
        address: string;
        transferOverhead: number;
        decimal: number;
        symbol: string;
        fixedDecimalPoint?: number;
    };
};
export declare const tokens: TokenConfig[];
export default tokens;
//# sourceMappingURL=index.d.ts.map