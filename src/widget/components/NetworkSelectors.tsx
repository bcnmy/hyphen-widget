import Select from "components/Select";
import { useChains } from "context/Chains";
import { useWalletProvider } from "context/WalletProvider";
import React, { useMemo } from "react";
import { HiArrowRight } from "react-icons/hi";
import CustomTooltip from "components/CustomTooltip";

interface INetworkSelectorsProps {
  allowedSourceChains?: number[];
  allowedDestinationChains?: number[];
}

const NetworkSelectors: React.FC<INetworkSelectorsProps> = ({
  allowedSourceChains = [],
  allowedDestinationChains = [],
}) => {
  const { isLoggedIn } = useWalletProvider()!;
  const { networks, fromChain, toChain, changeFromChain, changeToChain } =
    useChains()!;

  const fromChainOptions = useMemo(() => {
    let sourceChains = networks;

    if (allowedSourceChains.length > 0) {
      const allowedChains = networks?.filter((network) =>
        allowedSourceChains.includes(network.chainId)
      );

      if (allowedChains && allowedChains.length > 0) {
        sourceChains = allowedChains;
      }
    }

    return sourceChains?.map((network) => ({
      id: network.chainId,
      name: network.name,
      image: network.image,
    }));
  }, [allowedSourceChains, networks]);

  const toChainOptions = useMemo(() => {
    let destinationChains = networks?.filter(
      (network) => network.chainId !== fromChain?.chainId
    );

    if (allowedDestinationChains.length > 0) {
      const allowedChains = networks?.filter((network) =>
        allowedDestinationChains.includes(network.chainId)
      );

      if (allowedChains && allowedChains.length > 0) {
        destinationChains = allowedChains;
      }
    }

    return destinationChains?.map((network) => ({
      id: network.chainId,
      name: network.name,
      image: network.image,
    }));
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
    <>
      <div>
        {fromChainOptions ? (
          <Select
            options={fromChainOptions}
            selected={selectedFromChain}
            setSelected={(opt) => {
              networks &&
                changeFromChain(
                  networks.find((network) => network.chainId === opt.id)!
                );
            }}
            label={"source"}
          />
        ) : (
          "..."
        )}
      </div>
      <div className="mb-3 flex items-end">
        <div className="rounded-full border border-hyphen-purple/10 bg-hyphen-purple bg-opacity-20 p-2 text-hyphen-purple transition-all">
          <HiArrowRight />
        </div>
      </div>
      <div data-tip data-for="networkSelect">
        {toChainOptions ? (
          <Select
            disabled={!isLoggedIn}
            options={toChainOptions}
            selected={selectedToChain}
            setSelected={(opt) => {
              networks &&
                changeToChain(
                  networks.find((network) => network.chainId === opt.id)!
                );
            }}
            label={"destination"}
          />
        ) : (
          "..."
        )}
        {!isLoggedIn && (
          <CustomTooltip id="networkSelect">
            <span>Please connect your wallet</span>
          </CustomTooltip>
        )}
      </div>
    </>
  );
};

export default NetworkSelectors;
