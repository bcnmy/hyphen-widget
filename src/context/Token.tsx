import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { config } from 'config';
import { useChains } from 'context/Chains';
import { useWalletProvider } from 'context/WalletProvider';
import { BigNumber, ethers } from 'ethers';

import erc20ABI from 'abis/erc20.abi.json';
import { DEFAULT_FIXED_DECIMAL_POINT } from 'config/constants';
import useAsync, { Status } from 'hooks/useLoading';
import { Network } from 'hooks/useNetworks';
import useTokens, { Token } from 'hooks/useTokens';
import formatRawEthValue from 'utils/formatRawEthValue';
import toFixed from 'utils/toFixed';

interface ITokenBalance {
  formattedBalance: string;
  displayBalance: string;
  userRawBalance: BigNumber;
}

interface ITokenContext {
  changeSelectedToken: (tokenSymbol: string | undefined) => void;
  compatibleTokensForCurrentChains: undefined | Token[];
  getSelectedTokenBalanceStatus: undefined | Status;
  refreshSelectedTokenBalance: () => void;
  selectedToken: undefined | Token;
  selectedTokenBalance: undefined | ITokenBalance;
  tokens:
    | {
        [key: string]: Token;
      }
    | undefined;
  isTokensLoading: boolean;
  isTokensError: boolean;
}

const TokenContext = createContext<ITokenContext | null>(null);

function isTokenValidForChains(
  token: Token,
  fromChain: Network,
  toChain: Network
) {
  // return true if token has config available for both from and to chains
  // else return false
  return !!(
    token[fromChain.chainId]?.isSupportedOnBridge &&
    token[toChain.chainId]?.isSupportedOnBridge
  );
}

interface ITokenProviderProps {
  env?: string;
  allowedTokens?: string[];
  defaultToken?: string;
  apiKeys?: { [key: string]: string };
  rpcUrls?: { [key: string]: string };
}

const TokenProvider: React.FC<ITokenProviderProps> = (props) => {
  const { accounts } = useWalletProvider()!;
  const { fromChain, fromChainRpcUrlProvider, toChain } = useChains()!;
  const [selectedToken, setSelectedToken] = useState<Token>();

  const {
    data: tokens,
    isLoading: isTokensLoading,
    isError: isTokensError,
  } = useTokens(props.env, props.apiKeys, props.rpcUrls);

  // compute and memoize the compatible tokens
  const compatibleTokensForCurrentChains = useMemo(() => {
    if (!fromChain || !toChain) return;
    return tokens
      ? Object.keys(tokens)
          .filter((tokenSymbol: string) => {
            const token = tokens[tokenSymbol];
            return isTokenValidForChains(token, fromChain, toChain);
          })
          .map((tokenSymbol: string) => tokens[tokenSymbol])
      : [];
  }, [fromChain, toChain, tokens]);

  const tokenContract = useMemo(() => {
    if (!selectedToken || !fromChainRpcUrlProvider || !fromChain) return;
    if (!selectedToken[fromChain.chainId]) return;

    return new ethers.Contract(
      selectedToken[fromChain.chainId].address,
      erc20ABI,
      fromChainRpcUrlProvider
    );
  }, [selectedToken, fromChainRpcUrlProvider, fromChain]);

  // set the selected token to first compatible token for current chains on startup
  // or, upon chain change, if the currently selected token is not compatible, then do the same
  useEffect(() => {
    if (!fromChain || !toChain || !compatibleTokensForCurrentChains) {
      setSelectedToken(undefined);
      return;
    }

    // Check if allowedTokens is provided:
    // If it is, filter compatibleTokensForCurrentChains based on that list
    // fallback to compatibleTokensForCurrentChains if filtering produces no valid list.
    let allowedTokens = compatibleTokensForCurrentChains.filter((token) =>
      props.allowedTokens?.includes(token.symbol)
    );
    if (allowedTokens && allowedTokens.length === 0) {
      allowedTokens = compatibleTokensForCurrentChains;
    }

    // Sets the initial token, using the following precedence:
    // 1. defaultToken if it is compatible.
    // 2. The first token from available tokens if it is compatible.
    let newToken = allowedTokens[0];
    if (props.defaultToken) {
      const defaultTokenObj = allowedTokens.find(
        (token) => token.symbol === props.defaultToken
      );
      // If token for defaultToken is not found or is not compatible
      // with selected chains revert to the first token in the list
      // of available tokens.
      if (
        defaultTokenObj &&
        isTokenValidForChains(defaultTokenObj, fromChain, toChain)
      ) {
        newToken = defaultTokenObj;
      }
    }
    setSelectedToken(newToken);
  }, [
    compatibleTokensForCurrentChains,
    fromChain,
    props.allowedTokens,
    props.defaultToken,
    toChain,
  ]);

  const changeSelectedToken = useCallback(
    (tokenSymbol: string | undefined) => {
      if (!tokenSymbol) {
        setSelectedToken(undefined);
        return;
      }

      if (!fromChain || !toChain) {
        throw new Error("Chains aren't initialized yet");
      }

      const token = tokens![tokenSymbol];
      if (!isTokenValidForChains(token, fromChain, toChain)) {
        throw Error('Provided token is invalid choice for current chains');
      }
      setSelectedToken(token);
    },
    [fromChain, toChain, tokens]
  );

  // construct the async function that can be called to get user balance
  const getSelectedTokenBalance = useCallback(async () => {
    if (
      !fromChainRpcUrlProvider ||
      !tokenContract ||
      !selectedToken ||
      !fromChain ||
      !toChain ||
      !accounts ||
      !accounts[0]
    ) {
      throw new Error('Prerequisites not met');
    }
    let formattedBalance: string;
    let userRawBalance: BigNumber;

    // if selected token is native token for fromChain
    if (
      selectedToken[fromChain.chainId].address.toLowerCase() ===
      config.constants.NATIVE_ADDRESS
    ) {
      userRawBalance = await fromChainRpcUrlProvider.getBalance(accounts[0]);
      let decimals = fromChain.nativeDecimal;

      formattedBalance = formatRawEthValue(userRawBalance.toString(), decimals);
    } else {
      userRawBalance = await tokenContract.balanceOf(accounts[0]);
      let decimals = await tokenContract.decimals();

      formattedBalance = formatRawEthValue(userRawBalance.toString(), decimals);
    }
    let displayBalance = toFixed(formattedBalance, DEFAULT_FIXED_DECIMAL_POINT);

    return { formattedBalance, displayBalance, userRawBalance };
  }, [
    fromChainRpcUrlProvider,
    tokenContract,
    selectedToken,
    fromChain,
    toChain,
    accounts,
  ]);

  const {
    execute: refreshSelectedTokenBalance,
    value: selectedTokenBalance,
    status: getSelectedTokenBalanceStatus,
    // error: getSelectedTokenBalanceError,
  } = useAsync(getSelectedTokenBalance);

  useEffect(() => {
    refreshSelectedTokenBalance();
  }, [getSelectedTokenBalance, refreshSelectedTokenBalance]);

  return (
    <TokenContext.Provider
      value={{
        changeSelectedToken,
        compatibleTokensForCurrentChains,
        getSelectedTokenBalanceStatus,
        refreshSelectedTokenBalance,
        selectedToken,
        selectedTokenBalance,
        tokens,
        isTokensLoading,
        isTokensError,
      }}
      {...props}
    />
  );
};

const useToken = () => useContext(TokenContext);
export { TokenProvider, useToken };
