import transferArrow from 'assets/images/transfer-arrow.svg';
import CustomTooltip from 'components/CustomTooltip';
import Select from 'components/Select';
import { useChains } from 'context/Chains';
import { useToken } from 'context/Token';
import { useWalletProvider } from 'context/WalletProvider';
import React, { useMemo } from 'react';
import GaslessToggle from './GaslessToggle';

interface INetworkSelectorsProps {
  allowedSourceChains?: number[];
  allowedDestinationChains?: number[];
}

const NetworkSelectors: React.FC<INetworkSelectorsProps> = ({
  allowedSourceChains = [],
  allowedDestinationChains = [],
}) => {
  const { isLoggedIn } = useWalletProvider()!;
  const {
    networks,
    fromChain,
    toChain,
    changeFromChain,
    changeToChain,
    switchChains,
  } = useChains()!;
  const { changeSelectedToken } = useToken()!;

  const fromChainOptions = useMemo(() => {
    let sourceChains = networks;

    // Populate source chain options depending
    // upon allowedSourceChains list.
    if (allowedSourceChains.length > 0) {
      const allowedChains = sourceChains?.filter((network) =>
        allowedSourceChains.includes(network.chainId)
      );

      if (allowedChains && allowedChains.length > 0) {
        sourceChains = allowedChains;
      }
    }

    return (
      sourceChains
        // filter out networks which are disabled for bridge.
        ?.filter((network) => network.bridgeOpen)
        .map((network) => ({
          id: network.chainId,
          name: network.name,
          image: network.image,
        }))
    );
  }, [allowedSourceChains, networks]);

  const toChainOptions = useMemo(() => {
    let destinationChains = networks?.filter(
      (network) => network.chainId !== fromChain?.chainId
    );

    // Populate destination chain options depending
    // upon allowedDestinationChains list.
    if (allowedDestinationChains.length > 0) {
      const allowedChains = destinationChains?.filter((network) =>
        allowedDestinationChains.includes(network.chainId)
      );

      if (allowedChains && allowedChains.length > 0) {
        destinationChains = allowedChains;
      }
    }

    return (
      destinationChains
        // filter out networks which are disabled for bridge.
        ?.filter((network) => network.bridgeOpen)
        .map((network) => ({
          id: network.chainId,
          name: network.name,
          image: network.image,
        }))
    );
  }, [allowedDestinationChains, fromChain?.chainId, networks]);

  const selectedFromChain = useMemo(() => {
    if (!fromChain) return undefined;
    else return fromChainOptions?.find((opt) => opt.id === fromChain.chainId);
  }, [fromChain, fromChainOptions]);

  const selectedToChain = useMemo(() => {
    if (!toChain) return undefined;
    else return toChainOptions?.find((opt) => opt.id === toChain.chainId);
  }, [toChain, toChainOptions]);

  return (
    <div className="tw-hw-grid tw-hw-grid-cols-1 tw-hw-gap-3 md:tw-hw-grid-cols-[1fr_40px_1fr]">
      <div className="tw-hw-relative">
        {fromChainOptions ? (
          <Select
            options={fromChainOptions}
            selected={selectedFromChain}
            setSelected={(opt) => {
              if (networks) {
                // Reset the selected token
                changeSelectedToken(undefined);
                // Set new source chain
                changeFromChain(
                  networks.find((network) => network.chainId === opt.id)!
                );
              }
            }}
            label={'source'}
          />
        ) : (
          '...'
        )}
        <div className="tw-hw-absolute tw-hw-top-0 tw-hw-right-4">
          <GaslessToggle />
        </div>
      </div>
      <div className="tw-hw-flex tw-hw-items-end tw-hw-justify-center md:tw-hw-mb-3">
        <button onClick={switchChains}>
          <img
            src={transferArrow}
            alt="Direction of transfer"
            className="tw-hw-h-7.5 tw-hw-w-7.5 tw-hw-rotate-90 md:tw-hw-h-auto md:tw-hw-w-auto md:tw-hw-rotate-0"
          />
        </button>
      </div>
      <div data-tip data-for="networkSelect">
        {toChainOptions ? (
          <Select
            disabled={!isLoggedIn}
            options={toChainOptions}
            selected={selectedToChain}
            setSelected={(opt) => {
              if (networks) {
                // Reset the selected token
                changeSelectedToken(undefined);
                // Set new destination chain
                changeToChain(
                  networks.find((network) => network.chainId === opt.id)!
                );
              }
            }}
            label={'destination'}
          />
        ) : (
          '...'
        )}
        {!isLoggedIn && (
          <CustomTooltip id="networkSelect">
            <span>Please connect your wallet</span>
          </CustomTooltip>
        )}
      </div>
    </div>
  );
};

export default NetworkSelectors;
