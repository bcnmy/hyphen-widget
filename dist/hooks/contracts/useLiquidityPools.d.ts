import { ethers } from "ethers";
import { ChainConfig } from "../../config/chains";
declare function useLiquidityPools(chain: ChainConfig | undefined): {
    liquidityProvidersContract: ethers.Contract | undefined;
    liquidityProvidersContractSigner: ethers.Contract | undefined;
    getTransferFee: (tokenAddress: string, rawTransferAmount: string) => Promise<any>;
    getRewardAmount: (tokenAddress: string, rawDepositAmount: string) => any;
};
export default useLiquidityPools;
//# sourceMappingURL=useLiquidityPools.d.ts.map