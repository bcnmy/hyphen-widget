/// <reference types="react" />
import { Status } from '../hooks/useLoading';
declare type PoolInfo = {
    minDepositAmount: number;
    maxDepositAmount: number;
    fromLPManagerAddress: string;
    toLPManagerAddress: string;
};
interface IHyphenContext {
    hyphen: any;
    poolInfo: PoolInfo | undefined;
    getPoolInfoStatus: Status;
}
declare const HyphenProvider: React.FC<{
    test?: boolean;
}>;
declare const useHyphen: () => IHyphenContext | null;
export { HyphenProvider, useHyphen };
//# sourceMappingURL=Hyphen.d.ts.map