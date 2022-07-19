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
  tag: string;
  env?: string;
  apiKeys?: { [key: string]: string };
  rpcUrls?: { [key: string]: string };
}> = ({ children, tag, env, apiKeys, rpcUrls }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletProviderProvider>
        <ChainsProvider env={env} apiKeys={apiKeys} rpcUrls={rpcUrls}>
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
