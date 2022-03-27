import React from 'react';
interface INetworkSelectorsProps {
    setFromChain: (newValue: string) => void;
    setToChain: (newValue: string) => void;
    swapFromToChains: () => void;
    lockSourceChain?: boolean;
    lockDestinationChain?: boolean;
}
declare const NetworkSelectors: React.FC<INetworkSelectorsProps>;
export default NetworkSelectors;
//# sourceMappingURL=NetworkSelectors.d.ts.map