import React from "react";
import { ITransferRecord } from "../../context/TransactionInfoModal";
export interface ITransferInfoModal {
    transferRecord: ITransferRecord;
    isVisible: boolean;
    onClose: () => void;
}
export declare const TransferInfoModal: React.FC<ITransferInfoModal>;
export default TransferInfoModal;
//# sourceMappingURL=TransferInfoModal.d.ts.map