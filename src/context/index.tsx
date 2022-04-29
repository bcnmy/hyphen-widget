import { ChainConfig } from "config/chains";
import React from "react";
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

export const AppProviders: React.FC<{
  test: boolean;
  chains: ChainConfig[];
}> = ({ children, test, chains }) => {
  return (
    <WalletProviderProvider>
      <ChainsProvider chains={chains}>
        <GraphQLProvider>
          <NotificationsProvider>
            <TokenProvider>
              <BiconomyProvider>
                <HyphenProvider test={test}>
                  <TokenApprovalProvider>
                    <TransactionProvider test={test}>
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
  );
};

export default AppProviders;
