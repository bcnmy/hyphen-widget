import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

// @ts-ignore
import { ethers } from "ethers";
import { useWalletProvider } from "./WalletProvider";
import useNetworks, { Network } from "hooks/useNetworks";

interface IChainsContext {
  areChainsReady: boolean;
  fromChainRpcUrlProvider: undefined | ethers.providers.JsonRpcProvider;
  toChainRpcUrlProvider: undefined | ethers.providers.JsonRpcProvider;
  fromChain: undefined | Network;
  toChain: undefined | Network;
  changeFromChain: (chain: Network) => void;
  changeToChain: (chain: Network) => void;
  switchChains: () => void;
  networks: Network[] | undefined;
  isNetworksLoading: boolean;
  isNetworksError: boolean;
  selectedNetwork: Network | undefined;
  changeSelectedNetwork: (network: Network) => void;
}

const ChainsContext = createContext<IChainsContext | null>(null);

interface IChainsProviderProps {
  env?: string;
  allowedSourceChains?: number[];
  allowedDestinationChains?: number[];
  defaultSourceChain?: number;
  defaultDestinationChain?: number;
  apiKeys?: { [key: string]: string };
  rpcUrls?: { [key: string]: string };
}

const ChainsProvider: React.FC<IChainsProviderProps> = (props) => {
  const { currentChainId } = useWalletProvider()!;
  const {
    data: networks,
    isLoading: isNetworksLoading,
    isError: isNetworksError,
  } = useNetworks(props.env, props.apiKeys, props.rpcUrls);

  const [fromChain, setFromChain] = useState<Network>();
  const [toChain, setToChain] = useState<Network>();

  const [selectedNetwork, setSelectedNetwork] = useState<Network>();

  const [areChainsReady, setAreChainsReady] = useState(false);

  const fromChainRpcUrlProvider = useMemo(() => {
    if (!fromChain || !fromChain.rpc) return undefined;
    return new ethers.providers.JsonRpcProvider(fromChain.rpc);
  }, [fromChain]);

  const toChainRpcUrlProvider = useMemo(() => {
    if (!toChain || !toChain.rpc) return undefined;
    return new ethers.providers.JsonRpcProvider(toChain.rpc);
  }, [toChain]);

  useEffect(() => {
    // Check if allowedSourceChains are provided:
    // If it is filter networks based on that list
    // fallback to network if filtering produces no valid list.
    let allowedSourceChains = networks?.filter((network) =>
      props.allowedSourceChains?.includes(network.chainId)
    );
    if (allowedSourceChains && allowedSourceChains.length === 0) {
      allowedSourceChains = networks;
    }

    // Check if allowedDestinationChains are provided:
    // If it is filter networks based on that list
    // fallback to network if filtering produces no valid list.
    let allowedDestinationChains = networks?.filter((network) =>
      props.allowedDestinationChains?.includes(network.chainId)
    );
    if (allowedDestinationChains && allowedDestinationChains.length === 0) {
      allowedDestinationChains = networks;
    }

    // If a valid metamask chain is present use that.
    const currentMetamaskChain = allowedSourceChains?.find(
      (network) => network.chainId === currentChainId
    );

    // Sets the initial source chain, using the following precedence:
    // 1. defaultSourceChain.
    // 2. Metamask chain.
    // 3. The first chain from available/allowed chains.
    let newFromChain = allowedSourceChains?.[0];
    if (props.defaultSourceChain) {
      const defaultSourceChainObj = allowedSourceChains?.find(
        (network) => network.chainId === props.defaultSourceChain
      );
      // If chain for defaultSourceChain is not found
      // revert to the first chain as a fallback.
      if (defaultSourceChainObj) {
        newFromChain = defaultSourceChainObj;
      }
    } else if (currentMetamaskChain) {
      newFromChain = currentMetamaskChain;
    }
    setFromChain(newFromChain);

    // Sets the initial destination chain, using the following precedence:
    // 1. defaultDestinationChain.
    // 2. The first chain from available/allowed chains which is not the source chain.
    let newToChain = allowedDestinationChains?.find(
      (network) => network.chainId !== newFromChain?.chainId
    );
    if (props.defaultDestinationChain) {
      const defaultDestinationChainObj = allowedDestinationChains?.find(
        (network) => network.chainId === props.defaultDestinationChain
      );
      // If chain for defaultDestinationChain is not found
      // or it is the same as the defaultSourceChain
      // revert to the first chain which is different from
      // the source chain as a fallback.
      if (defaultDestinationChainObj) {
        newToChain = defaultDestinationChainObj;
      }
    }
    setToChain(newToChain);
  }, [
    currentChainId,
    networks,
    props.allowedDestinationChains,
    props.allowedSourceChains,
    props.defaultDestinationChain,
    props.defaultSourceChain,
  ]);

  useEffect(() => {
    const network = networks?.find(
      (chainObj) => chainObj.chainId === currentChainId
    );

    if (network) {
      setSelectedNetwork(network);
    }
  }, [currentChainId, networks]);

  useEffect(() => {
    (async () => {
      if (
        fromChain &&
        fromChainRpcUrlProvider &&
        fromChain.chainId ===
          (await fromChainRpcUrlProvider.getNetwork()).chainId &&
        toChain &&
        toChainRpcUrlProvider &&
        toChain.chainId === (await toChainRpcUrlProvider.getNetwork()).chainId
      ) {
        setAreChainsReady(true);
      } else {
        setAreChainsReady(false);
      }
    })();
  });

  const changeFromChain = useCallback(
    (chain: Network) => {
      // If the new source chain is same as destination chain
      // reset the destination chain.
      if (toChain && chain.chainId === toChain.chainId) {
        setToChain(undefined);
      }
      setFromChain(chain);
    },
    [toChain]
  );

  const changeToChain = useCallback(
    (chain: Network) => {
      if (fromChain) {
        setToChain(chain);
      }
    },
    [fromChain]
  );

  const switchChains = useCallback(() => {
    if (fromChain && toChain) {
      setFromChain(toChain);
      setToChain(fromChain);
    }
  }, [toChain, fromChain]);

  const changeSelectedNetwork = useCallback((network: Network) => {
    setSelectedNetwork(network);
  }, []);

  return (
    <ChainsContext.Provider
      value={{
        areChainsReady,
        switchChains,
        changeFromChain,
        changeToChain,
        fromChainRpcUrlProvider,
        toChainRpcUrlProvider,
        fromChain,
        toChain,
        networks,
        isNetworksLoading,
        isNetworksError,
        selectedNetwork,
        changeSelectedNetwork,
      }}
      {...props}
    />
  );
};

const useChains = () => useContext(ChainsContext);
export { ChainsProvider, useChains };
