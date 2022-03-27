export declare const config: {
    chains: import("./chains").ChainConfig[];
    chainMap: import("./chains/chainMap").ChainMap;
    tokens: import("./tokens").TokenConfig[];
    hyphen: {
        baseURL: {
            test: string;
            prod: string;
        };
        getTokenGasPricePath: string;
    };
    constants: {
        NATIVE_ADDRESS: string;
        DEFAULT_FIXED_DECIMAL_POINT: number;
    };
};
export default config;
//# sourceMappingURL=index.d.ts.map