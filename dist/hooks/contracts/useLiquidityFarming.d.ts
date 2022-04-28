import { BigNumber } from 'ethers';
import { ChainConfig } from 'config/chains';
declare function useLiquidityFarming(chain: ChainConfig | undefined): {
    claimFee: (positionId: BigNumber, accounts: string[]) => any;
    getPendingToken: (positionId: BigNumber) => any;
    getStakedUserPositions: (accounts: string[]) => any;
    getRewardRatePerSecond: (address: string) => any;
    getRewardTokenAddress: (address: string) => any;
    getTotalSharesStaked: (address: string) => any;
    stakeNFT: (positionId: BigNumber, accounts: string[]) => any;
    unstakeNFT: (positionId: BigNumber, accounts: string[]) => any;
};
export default useLiquidityFarming;
//# sourceMappingURL=useLiquidityFarming.d.ts.map