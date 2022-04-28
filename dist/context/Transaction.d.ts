import { FormEvent } from "react";
import { Status } from "../hooks/useLoading";
export declare enum ValidationErrors {
    INVALID_AMOUNT = 0,
    AMOUNT_LT_MIN = 1,
    AMOUNT_GT_MAX = 2,
    INADEQUATE_BALANCE = 3,
    POOLINFO_NOT_LOADED = 4,
    BALANCE_NOT_LOADED = 5
}
interface ITransactionContext {
    transferAmount: number | null | undefined;
    transferAmountInputValue: undefined | string;
    changeTransferAmountInputValue: (amount: string) => void;
    fetchTransactionFeeStatus: Status;
    fetchTransactionFeeError: Error | undefined;
    transactionFee: undefined | {
        lpFeeProcessedString: string;
        transactionFeeProcessedString: string;
        amountToGetProcessedString: string;
        rewardAmountString: string | undefined;
        transferFeePercentage: string | undefined;
    };
    transactionAmountValidationErrors: ValidationErrors[];
    receiver: {
        receiverAddress: string;
        isReceiverValid: boolean;
    };
    changeReceiver: (event: FormEvent<HTMLInputElement>) => void;
    executeDeposit: (receiverAddress: string) => void;
    executeDepositError: Error | undefined;
    executeDepositStatus: Status;
    executeDepositValue: any;
    executePreDepositCheck: () => void;
    executePreDepositCheckError: Error | undefined;
    executePreDepositCheckStatus: Status;
    executePreDepositCheckValue: any;
    checkReceival: () => Promise<string | null>;
    setExitHash: (exitHash: string | undefined) => void;
    exitHash: string | undefined;
    getExitInfoFromHash: (exitHash: string) => Promise<string>;
}
declare const TransactionProvider: React.FC<{
    test: boolean;
}>;
declare const useTransaction: () => ITransactionContext | null;
export { TransactionProvider, useTransaction };
//# sourceMappingURL=Transaction.d.ts.map