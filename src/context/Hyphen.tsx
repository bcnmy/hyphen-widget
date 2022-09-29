import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

// @ts-ignore
import { Hyphen, SIGNATURE_TYPES } from '@biconomy/hyphen';

import { Environment } from '@biconomy/hyphen/dist/types';
import useAsync, { Status } from 'hooks/useLoading';
import { ENV } from 'types/environment';
import { useBiconomy } from './Biconomy';
import { useChains } from './Chains';
import { useToken } from './Token';
import { useWalletProvider } from './WalletProvider';
import { useQuery } from 'react-query';

type PoolInfo = {
  minDepositAmount: number;
  maxDepositAmount: number;
  fromLPManagerAddress: string;
  toLPManagerAddress: string;
};

interface IHyphenContext {
  hyphen: any;
  poolInfo: PoolInfo | undefined;
  isPoolInfoAvailable: boolean;
}

const HyphenContext = createContext<IHyphenContext | null>(null);

const HyphenProvider: React.FC<{ env?: string }> = (props) => {
  const { rawEthereumProvider, walletProvider } = useWalletProvider()!;
  const { selectedToken } = useToken()!;
  const { isBiconomyEnabled } = useBiconomy()!;
  const { fromChainRpcUrlProvider, fromChain, toChain, areChainsReady } =
    useChains()!;
  const [hyphen, setHyphen] = useState<any>(undefined);

  useEffect(() => {
    async function initHyphen(isBiconomyEnabled: boolean) {
      if (!rawEthereumProvider || !walletProvider || !fromChainRpcUrlProvider)
        return;

      let hyphenObj;
      if (isBiconomyEnabled) {
        hyphenObj = new Hyphen(fromChainRpcUrlProvider, {
          debug: true,
          infiniteApproval: true,
          environment: {
            [ENV.production]: 'prod',
            [ENV.test]: 'test',
            [ENV.staging]: 'staging',
            local: '',
          }[props.env || 'staging'] as Environment,
          biconomy: {
            enable: isBiconomyEnabled,
            apiKey: fromChain?.gasless.apiKey ?? '',
            debug: false,
          },
          signatureType: SIGNATURE_TYPES.EIP712,
          walletProvider: rawEthereumProvider,
        });
      } else {
        hyphenObj = new Hyphen(rawEthereumProvider, {
          debug: true,
          infiniteApproval: true,
          environment: {
            [ENV.production]: 'prod',
            [ENV.test]: 'test',
            [ENV.staging]: 'staging',
            local: '',
          }[props.env || 'staging'] as Environment,
          signatureType: SIGNATURE_TYPES.EIP712,
        });
      }

      await hyphenObj.init();
      setHyphen(hyphenObj);
    }

    initHyphen(isBiconomyEnabled);
  }, [
    fromChain?.gasless.apiKey,
    fromChainRpcUrlProvider,
    isBiconomyEnabled,
    props.env,
    rawEthereumProvider,
    walletProvider,
  ]);

  const { data: poolInfo, isSuccess: isPoolInfoAvailable } = useQuery(
    [fromChain?.chainId, toChain?.chainId, selectedToken?.symbol],
    () => {
      if (hyphen && fromChain && toChain && selectedToken) {
        return hyphen.liquidityPool.getPoolInformation(
          selectedToken[fromChain.chainId].address,
          fromChain.chainId,
          toChain.chainId
        );
      }
    },
    {
      enabled: !!(hyphen && fromChain && toChain && selectedToken),
    }
  );

  return (
    <HyphenContext.Provider
      value={{
        hyphen,
        isPoolInfoAvailable,
        poolInfo,
      }}
      {...props}
    />
  );
};

const useHyphen = () => useContext(HyphenContext);
export { HyphenProvider, useHyphen };
