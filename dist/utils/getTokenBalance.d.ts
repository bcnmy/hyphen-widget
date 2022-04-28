import { ChainConfig } from 'config/chains';
import { TokenConfig } from 'config/tokens';
import { BigNumber } from 'ethers';
declare function getTokenBalance(accountAddress: string, chain: ChainConfig, token: TokenConfig): Promise<{
    displayBalance: string;
    formattedBalance: string;
    userRawBalance: BigNumber;
} | undefined>;
export default getTokenBalance;
//# sourceMappingURL=getTokenBalance.d.ts.map