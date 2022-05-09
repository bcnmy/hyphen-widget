import config from "config";
import { useQuery } from "react-query";
import useNetworks from "./useNetworks";

export type Token = {
  symbol: string;
  image: string;
  coinGeckoId: string;
  [chainId: number]: {
    address: string;
    transferOverhead: number;
    decimal: number;
    symbol: string;
    chainColor: string;
    isSupported?: boolean;
    metaTransactionData: {
      supportsEip2612: boolean;
      eip2612Data: {
        name: string;
        version: number;
        chainId: number;
      };
    };
  };
};

function fetchTokens(env: string): Promise<{
  [key: string]: Token;
}> {
  const tokensEndpoint = `${config.getBaseURL(
    env
  )}/api/v1/configuration/tokens`;

  return fetch(tokensEndpoint)
    .then((res) => res.json())
    .then((data) =>
      data.message.reduce((acc: any, token: Token) => {
        const { symbol } = token;
        return {
          ...acc,
          [symbol]: token,
        };
      }, {})
    );
}

function useTokens(env = "", apiKeys = {}, rpcUrls = {}) {
  const { data: networks } = useNetworks();

  return useQuery<
    {
      [key: string]: Token;
    },
    Error
  >(["tokens", env], () => fetchTokens(env), {
    enabled: !!networks,
  });
}

export default useTokens;
