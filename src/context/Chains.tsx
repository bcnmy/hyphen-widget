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

  // default from chain to current metamak chain on startup
  // else if default chain is not supported, then use the first supported chain
  useEffect(() => {
    if (!currentChainId) {
      setFromChain(networks?.[0]);
      return;
    }
    let currentMetamaskChain = networks?.find(
      (network) => network.chainId === currentChainId
    );

    // Sets the initial source chain, using the following precedence:
    // 1. defaultSourceChain.
    // 2. Metamask chain.
    // 3. The first chain from available chains.
    let newFromChain: Network | undefined;
    if (props.defaultSourceChain) {
      const defaultSourceChainObj = networks?.find(
        (network) => network.chainId === props.defaultSourceChain
      );
      // If chain for defaultSourceChain is not found
      // revert to the first chain as a fallback.
      newFromChain = defaultSourceChainObj ?? networks?.[0];
    } else if (currentMetamaskChain) {
      newFromChain = currentMetamaskChain;
    } else {
      newFromChain = networks?.[0];
    }
    setFromChain(newFromChain);

    // Sets the initial destination chain, using the following precedence:
    // 1. defaultDestinationChain.
    // 2. The first chain from available chains which is not the source chain.
    let newToChain: Network | undefined;
    if (props.defaultDestinationChain) {
      const defaultDestinationChainObj = networks?.find(
        (network) => network.chainId === props.defaultDestinationChain
      );
      // If chain for defaultDestinationChain is not found
      // or it is the same as the defaultSourceChain
      // revert to the first chain which is different from
      // the source chain as a fallback.
      newToChain =
        defaultDestinationChainObj &&
        defaultDestinationChainObj.chainId !== newFromChain?.chainId
          ? defaultDestinationChainObj
          : networks?.find(
              (network) => network.chainId !== newFromChain?.chainId
            );
    } else {
      newToChain = networks?.find(
        (network) => network.chainId !== newFromChain?.chainId
      );
    }
    setToChain(newToChain);
  }, [
    currentChainId,
    networks,
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
