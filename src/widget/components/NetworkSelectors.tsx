import Select from '../../components/Select';
import { useChains } from '../../context/Chains';
import { useWalletProvider } from '../../context/WalletProvider';
import React, { useMemo } from 'react';
import { HiArrowRight } from 'react-icons/hi';
import CustomTooltip from './CustomTooltip';

interface INetworkSelectorsProps {
  setFromChain: (newValue: string) => void;
  setToChain: (newValue: string) => void;
  swapFromToChains: () => void;
  lockSourceChain?: boolean;
  lockDestinationChain?: boolean;
}

const NetworkSelectors: React.FC<INetworkSelectorsProps> = ({
  setFromChain,
  setToChain,
  swapFromToChains,
  lockSourceChain,
  lockDestinationChain,
}) => {
  const { isLoggedIn } = useWalletProvider()!;
  const {
    chainsList,
    fromChain,
    toChain,
    compatibleToChainsForCurrentFromChain,
  } = useChains()!;

  const fromChainOptions = useMemo(
    () =>
      chainsList.map((chain) => ({
        id: chain.chainId,
        name: chain.name,
        image: chain.image,
      })),
    [chainsList]
  );

  const toChainOptions = useMemo(() => {
    if (!compatibleToChainsForCurrentFromChain) return [];
    else
      return compatibleToChainsForCurrentFromChain
        .map((chain) => ({
          id: chain.chainId,
          name: chain.name,
          image: chain.image,
        }))
        .filter((f) => chainsList.find((e) => e.chainId === f.id));
  }, [chainsList, compatibleToChainsForCurrentFromChain]);

  const selectedFromChain = useMemo(() => {
    if (!fromChain) return undefined;
    else return fromChainOptions.find((opt) => opt.id === fromChain.chainId);
  }, [fromChain, fromChainOptions]);

  const selectedToChain = useMemo(() => {
    if (!toChain) return undefined;
    else return toChainOptions.find((opt) => opt.id === toChain.chainId);
  }, [toChain, toChainOptions]);

  return (
    <>
      <div>
        <Select
          options={fromChainOptions}
          selected={selectedFromChain}
          setSelected={(opt) => {
            chainsList && setFromChain(opt.name);
          }}
          label={'source'}
          disabled={lockSourceChain}
        />
      </div>
      <div className="mb-1.5 flex items-end">
        <button
          className="bg-hyphen-purple border-hyphen-purple/10 text-hyphen-purple rounded-full border bg-opacity-20 p-2 transition-all"
          onClick={swapFromToChains}
          disabled={lockSourceChain || lockDestinationChain}
        >
          <HiArrowRight />
        </button>
      </div>
      <div data-tip data-for="networkSelect">
        <Select
          disabled={!isLoggedIn || lockDestinationChain}
          options={toChainOptions}
          selected={selectedToChain}
          setSelected={(opt) => {
            chainsList && setToChain(opt.name);
          }}
          label={'destination'}
        />
        {!isLoggedIn && (
          <CustomTooltip id="networkSelect" text="Please connect your wallet" />
        )}
      </div>
    </>
  );
};

export default NetworkSelectors;
