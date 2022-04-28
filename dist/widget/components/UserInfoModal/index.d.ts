/// <reference types="react" />
import { TokenConfig } from "../../../config/tokens";
import { ChainConfig } from "../../../config/chains";
export interface IUserInfoModalProps {
    isVisible: boolean;
    onClose: () => void;
}
export interface IUserDeposits {
    id: string;
    amount: string;
    rewardAmount: string;
    timestamp: string;
    tokenAddress: string;
    toChainID: string;
}
export interface ITransactionDetails {
    amount: string;
    amountReceived: string;
    depositHash: string;
    endTimestamp: number;
    exitHash: string;
    fromChain: ChainConfig;
    fromChainExplorerUrl: string;
    gasFee: string;
    lpFee: string;
    rewardAmount: string;
    startTimestamp: number;
    toChain: ChainConfig;
    toChainExplorerUrl: string;
    token: TokenConfig;
    transactionFee: string;
}
declare function UserInfoModal({ isVisible, onClose }: IUserInfoModalProps): JSX.Element;
export default UserInfoModal;
//# sourceMappingURL=index.d.ts.map