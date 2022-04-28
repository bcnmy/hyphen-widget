import { BigNumber } from 'ethers';
import { ChainConfig } from 'config/chains';
declare function useLPToken(chain: ChainConfig | undefined): {
    getNFTApprovalAddress: (positionId: BigNumber) => any;
    getNFTApproval: (address: string, positionId: BigNumber) => any;
    getPositionMetadata: (positionId: BigNumber) => any;
    getTokenURI: (positionId: BigNumber) => any;
    getUserPositions: (accounts: string[]) => any;
};
export default useLPToken;
//# sourceMappingURL=useLPToken.d.ts.map