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
import { ChainConfig } from "../config/chains";
import { config } from "../config";
import { useWalletProvider } from "./WalletProvider";

interface IChainsContext {
  areChainsReady: boolean;
  fromChainRpcUrlProvider: undefined | ethers.providers.JsonRpcProvider;
  toChainRpcUrlProvider: undefined | ethers.providers.JsonRpcProvider;
  fromChain: undefined | ChainConfig;
  toChain: undefined | ChainConfig;
  compatibleToChainsForCurrentFromChain: undefined | ChainConfig[];
  changeFromChain: (chain: ChainConfig) => void;
  changeToChain: (chain: ChainConfig) => void;
  switchChains: () => void;
  chainsList: ChainConfig[];
  selectedNetwork: ChainConfig | undefined;
  changeSelectedNetwork: (network: ChainConfig) => void;
}

const chainsList = config.chains;

const ChainsContext = createContext<IChainsContext | null>(null);

const ChainsProvider: React.FC<{ chains: ChainConfig[] }> = (props) => {
  const { currentChainId } = useWalletProvider()!;

  const [fromChain, setFromChain] = useState<ChainConfig>();
  const [toChain, setToChain] = useState<ChainConfig>();

  const [selectedNetwork, setSelectedNetwork] = useState<ChainConfig>();

  const [areChainsReady, setAreChainsReady] = useState(false);

  const fromChainRpcUrlProvider = useMemo(() => {
    if (!fromChain) return undefined;
    return new ethers.providers.JsonRpcProvider(fromChain.rpcUrl);
  }, [fromChain]);

  const toChainRpcUrlProvider = useMemo(() => {
    if (!toChain) return undefined;
    return new ethers.providers.JsonRpcProvider(toChain.rpcUrl);
  }, [toChain]);

  // default from chain to current metamak chain on startup
  // else if default chain is not supported, then use the first supported chain
  useEffect(() => {
    setToChain(undefined);
    if (!currentChainId) {
      setFromChain(chainsList[0]);
      return;
    }
    let currentMetamaskChain = chainsList.find(
      (chain) => chain.chainId === currentChainId
    );

    if (currentMetamaskChain) {
      setFromChain(currentMetamaskChain);
    } else {
      setFromChain(chainsList[0]);
    }
  }, [currentChainId]);

  useEffect(() => {
    const network = chainsList.find(
      (chainObj) => chainObj.chainId === currentChainId
    );

    if (network) {
      setSelectedNetwork(network);
    }
  }, [currentChainId]);

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

  const compatibleToChainsForCurrentFromChain = useMemo(() => {
    if (!fromChain) return undefined;
    return config.chainMap[fromChain.chainId].map(
      (compatibleChainId) =>
        config.chains.find(
          (chain) => chain.chainId === compatibleChainId
        ) as ChainConfig
    );
  }, [fromChain]);

  const changeFromChain = useCallback((chain: ChainConfig) => {
    setToChain(undefined);
    setFromChain(chain);
  }, []);

  const changeToChain = useCallback(
    (chain: ChainConfig) => {
      if (
        fromChain &&
        config.chainMap[fromChain.chainId].includes(chain.chainId)
      ) {
        setToChain(chain);
      } else {
        throw new Error("To Chain not supported for current from chain");
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

  const changeSelectedNetwork = useCallback((network: ChainConfig) => {
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
        compatibleToChainsForCurrentFromChain,
        fromChain,
        toChain,
        chainsList: props.chains,
        selectedNetwork,
        changeSelectedNetwork,
      }}
      {...props}
    />
  );
};

const useChains = () => useContext(ChainsContext);
export { ChainsProvider, useChains };
