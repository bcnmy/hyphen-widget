import React from "react";
export interface IApprovalModalProps {
    executeTokenApproval: (isInfiniteApproval: boolean, amount: number) => void;
    isVisible: boolean;
    onClose: () => void;
    selectedChainName: string;
    selectedTokenName: string;
    transferAmount: number;
}
export declare const ApprovalModal: React.FC<IApprovalModalProps>;
export default ApprovalModal;
//# sourceMappingURL=ApprovalModal.d.ts.map