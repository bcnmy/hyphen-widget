/// <reference types="react" />
import { Status } from "../hooks/useLoading";
interface ITokenApprovalContext {
    checkSelectedTokenApproval: (amount: number) => Promise<boolean>;
    approveToken: (isInfiniteApproval: boolean, tokenAmount: number) => Promise<void>;
    executeApproveToken: (isInfiniteApproval: boolean, tokenAmount: number) => void;
    executeApproveTokenStatus: Status;
    executeApproveTokenError: Error | undefined;
    fetchSelectedTokenApproval: (amount: number) => void;
    fetchSelectedTokenApprovalStatus: Status;
    fetchSelectedTokenApprovalError: Error | undefined;
    fetchSelectedTokenApprovalValue: boolean | undefined;
}
declare const TokenApprovalProvider: React.FC;
declare const useTokenApproval: () => ITokenApprovalContext | null;
export { TokenApprovalProvider, useTokenApproval };
//# sourceMappingURL=TokenApproval.d.ts.map