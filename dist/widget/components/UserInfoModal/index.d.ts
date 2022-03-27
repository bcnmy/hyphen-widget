/// <reference types="react" />
export interface IUserInfoModalProps {
    isVisible: boolean;
    onClose: () => void;
}
export interface ITransaction {
    amount: number;
    from: string;
    id: string;
    receiver: string;
    timestamp: string;
    toChainId: string;
    tokenAddress: string;
    __typename: string;
}
export interface ITransactionDetails {
    amount: string;
    amountReceived: string;
    depositHash: string;
    endTimeStamp: number;
    fromChainId: number;
    fromChainExplorerUrl: string;
    fromChainLabel: string;
    lpFee: string;
    receivedTokenAddress: string;
    receivedTokenSymbol: string;
    receiver: string;
    startTimeStamp: number;
    toChainId: number;
    toChainExplorerUrl: string;
    toChainLabel: string;
    tokenSymbol: string;
    transferHash: string;
}
declare function UserInfoModal({ isVisible, onClose }: IUserInfoModalProps): JSX.Element;
export default UserInfoModal;
//# sourceMappingURL=index.d.ts.map