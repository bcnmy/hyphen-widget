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

const queryClient = new QueryClient();

export const AppProviders: React.FC<{
  options: HyphenWidgetOptions;
}> = ({ children, options }) => {
  const {
    tag,
    env,
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
          defaultSourceChain={defaultSourceChain}
          defaultDestinationChain={defaultDestinationChain}
          apiKeys={apiKeys}
          rpcUrls={rpcUrls}
        >
          <GraphQLProvider>
            <NotificationsProvider>
              <TokenProvider env={env} apiKeys={apiKeys} rpcUrls={rpcUrls}>
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
