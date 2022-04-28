/// <reference types="react" />
import { ChainConfig } from "../config/chains";
import { TokenConfig } from "../config/tokens";
export interface ITransferRecord {
    depositHash: string;
    depositAmount: string;
    exitHash: string;
    token: TokenConfig;
    fromChain: ChainConfig;
    toChain: ChainConfig;
    lpFee: string;
    transferredAmount: string;
    transactionFee: string;
    transferTime: string;
    rewardAmount?: string;
}
interface ITransactionInfoModalContext {
    showTransactionInfoModal: (transferRecord: ITransferRecord) => void;
}
declare const TransactionInfoModalProvider: React.FC;
declare const useTransactionInfoModal: () => ITransactionInfoModalContext | null;
export { TransactionInfoModalProvider, useTransactionInfoModal };
//# sourceMappingURL=TransactionInfoModal.d.ts.map