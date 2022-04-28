import { ChainConfig } from 'config/chains';
declare function useWhitelistPeriodManager(chain: ChainConfig | undefined): {
    getTokenTotalCap: (tokenAddress: string | undefined) => any;
    getTokenWalletCap: (tokenAddress: string | undefined) => any;
    getTotalLiquidityByLp: (tokenAddress: string | undefined, accounts: string[] | undefined) => any;
};
export default useWhitelistPeriodManager;
//# sourceMappingURL=useWhitelistPeriodManager.d.ts.map