import { HyphenWidgetOptions } from "index";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { BiconomyProvider } from "./Biconomy";
import { ChainsProvider } from "./Chains";
import { GraphQLProvider } from "./GraphQL";
import { HyphenProvider } from "./Hyphen";
import { NotificationsProvider } from "./Notifications";
import { TokenProvider } from "./Token";
import { TokenApprovalProvider } from "./TokenApproval";
import { TransactionProvider } from "./Transaction";
import { TransactionInfoModalProvider } from "./TransactionInfoModal";
import { WalletProviderProvider } from "./WalletProvider";

const queryClientOptions = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
    },
  },
};
const queryClient = new QueryClient(queryClientOptions);

export const AppProviders: React.FC<{
  options: HyphenWidgetOptions;
}> = ({ children, options }) => {
  const {
    tag,
    env,
    allowedSourceChains,
    allowedDestinationChains,
    allowedTokens,
    defaultSourceChain,
    defaultDestinationChain,
    defaultToken,
    apiKeys,
    rpcUrls,
  } = options;

  return (
    <QueryClientProvider client={queryClient}>
      <WalletProviderProvider>
        <ChainsProvider
          env={env}
          allowedSourceChains={allowedSourceChains}
          allowedDestinationChains={allowedDestinationChains}
          defaultSourceChain={defaultSourceChain}
          defaultDestinationChain={defaultDestinationChain}
          apiKeys={apiKeys}
          rpcUrls={rpcUrls}
        >
          <GraphQLProvider>
            <NotificationsProvider>
              <TokenProvider
                env={env}
                allowedTokens={allowedTokens}
                defaultToken={defaultToken}
                apiKeys={apiKeys}
                rpcUrls={rpcUrls}
              >
                <BiconomyProvider>
                  <HyphenProvider env={env}>
                    <TokenApprovalProvider>
                      <TransactionProvider env={env} tag={tag}>
                        <TransactionInfoModalProvider>
                          {children}
                        </TransactionInfoModalProvider>
                      </TransactionProvider>
                    </TokenApprovalProvider>
                  </HyphenProvider>
                </BiconomyProvider>
              </TokenProvider>
            </NotificationsProvider>
          </GraphQLProvider>
        </ChainsProvider>
      </WalletProviderProvider>
    </QueryClientProvider>
  );
};

export default AppProviders;
