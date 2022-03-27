/// <reference types="react" />
import { TokenConfig } from '../config/tokens';
import { BigNumber } from 'ethers';
import { Status } from '../hooks/useLoading';
interface ITokenBalance {
    formattedBalance: string;
    displayBalance: string;
    userRawBalance: BigNumber;
}
interface ITokenContext {
    changeSelectedToken: (token: TokenConfig) => void;
    compatibleTokensForCurrentChains: undefined | TokenConfig[];
    getSelectedTokenBalanceStatus: undefined | Status;
    refreshSelectedTokenBalance: () => void;
    selectedToken: undefined | TokenConfig;
    selectedTokenBalance: undefined | ITokenBalance;
    tokensList: TokenConfig[];
}
declare const TokenProvider: React.FC;
declare const useToken: () => ITokenContext | null;
export { TokenProvider, useToken };
//# sourceMappingURL=Token.d.ts.map