/// <reference types="react" />
import { ITransactionDetails } from "../UserInfoModal";
export interface ITransactionDetailModal {
    isVisible: boolean;
    onClose: () => void;
    transactionDetails: ITransactionDetails | undefined;
}
declare function TransactionDetailModal({ isVisible, onClose, transactionDetails, }: ITransactionDetailModal): JSX.Element | null;
export default TransactionDetailModal;
//# sourceMappingURL=index.d.ts.map