import { BigNumber } from 'ethers';
import { ChainConfig } from 'config/chains';
declare function useLiquidityProviders(chain: ChainConfig | undefined): {
    addLiquidity: (tokenAddress: string, amount: BigNumber) => any;
    addNativeLiquidity: (amount: BigNumber) => any;
    claimFee: (positionId: BigNumber) => any;
    getBaseDivisor: () => any;
    getSuppliedLiquidityByToken: (tokenAddress: string) => any;
    getTokenAmount: (shares: BigNumber, tokenAddress: string) => any;
    getTokenPriceInLPShares: (tokenAddress: string | undefined) => any;
    getTotalLiquidity: (tokenAddress: string | undefined) => any;
    getTotalSharesMinted: (tokenAddress: string | undefined) => any;
    increaseLiquidity: (positionId: BigNumber, amount: BigNumber) => any;
    increaseNativeLiquidity: (positionId: BigNumber, amount: BigNumber) => any;
    removeLiquidity: (positionId: BigNumber, amount: BigNumber) => any;
};
export default useLiquidityProviders;
//# sourceMappingURL=useLiquidityProviders.d.ts.map