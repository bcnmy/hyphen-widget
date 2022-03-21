import React, { useEffect } from "react";

import { useWalletProvider } from "../context/WalletProvider";
import { useChains } from "../context/Chains";

import NetworkSelectors from "./components/NetworkSelectors";
import TokenSelector from "./components/TokenSelector";
import AmountInput from "./components/AmountInput";
import TransactionFee from "./components/TransactionFee";
import ChangeReceiverAddress from "./components/ChangeReceiverAddress";
import CallToAction from "./components/CallToAction";
import { Toggle } from "../components/Toggle";
import useModal from "../hooks/useModal";
import ApprovalModal from "./components/ApprovalModal";
import { useTokenApproval } from "../context/TokenApproval";
import ErrorModal from "./components/ErrorModal";
import TransferModal from "./components/TransferModal";
import UserInfoModal from "./components/UserInfoModal";
import { useTransaction } from "../context/Transaction";
import { useBiconomy } from "../context/Biconomy";
import { twMerge } from "tailwind-merge";
import CustomTooltip from "./components/CustomTooltip";
import { FaInfoCircle } from "react-icons/fa";
import { HiInformationCircle } from "react-icons/hi";

interface WidgetProps {
  sourceChain?: string;
  destinationChain?: string;
  token?: string;
  amount?: string;
  receiver?: string;
  lockSourceChain?: boolean;
  lockDestinationChain?: boolean;
  lockToken?: boolean;
  lockAmount?: boolean;
  onSourceChainChange?: (prev: string, to: string) => any;
  onDestinationChainChange?: (prev: string, to: string) => any;
  onTokenChange?: (prev: string, to: string) => any;
  onAmountChange?: (prev: string, to: string) => any;
  onReceiverChange?: (prev: string, to: string) => any;
}

const Home: React.FC<WidgetProps> = (props) => {
  const { areChainsReady } = useChains()!;
  const { changeTransferAmountInputValue } = useTransaction()!;
  const { isBiconomyAllowed, setIsBiconomyToggledOn, isBiconomyEnabled } =
    useBiconomy()!;
  const { isLoggedIn, connect } = useWalletProvider()!;
  const {
    isVisible: isApprovalModalVisible,
    hideModal: hideApprovalModal,
    showModal: showApprovalModal,
  } = useModal();
  const {
    isVisible: isTransferModalVisible,
    hideModal: hideTransferlModal,
    showModal: showTransferModal,
  } = useModal();
  const { executeApproveTokenError } = useTokenApproval()!;

  useEffect(() => {
    (async () => {
      await connect().catch((e) => {
        console.error(e);
      });
    })();
  }, [isLoggedIn, connect]);

  return (
    <>
      <ApprovalModal
        isVisible={isApprovalModalVisible}
        onClose={hideApprovalModal}
      />
      <TransferModal
        isVisible={isTransferModalVisible}
        onClose={() => {
          changeTransferAmountInputValue("");
          hideTransferlModal();
        }}
      />
      <ErrorModal error={executeApproveTokenError} title={"Approval Error"} />
      <div className="my-0 hyphen-widget-modal">
        <div className="max-w-xl mx-auto">
          <div className="relative z-10">
            <div className="flex flex-col gap-2 p-6 bg-white shadow-lg rounded-3xl">
              <div className="flex items-center justify-end mb-2">
                <div className="flex items-center">
                  <HiInformationCircle
                    data-tip
                    data-for="gaslessMode"
                    className="mr-2 text-gray-500"
                  />
                  <CustomTooltip
                    id="gaslessMode"
                    text="This transaction is sponsored by Biconomy"
                  />
                  <div
                    className={
                      !isBiconomyAllowed
                        ? "flex opacity-50 cursor-not-allowed"
                        : "flex"
                    }
                    data-tip
                    data-for="whyGaslessDisabled"
                  >
                    <span className="mr-2 text-base font-semibold text-gray-500">
                      Gasless Mode
                    </span>
                    <Toggle
                      label="Gasless Mode"
                      enabled={isBiconomyEnabled}
                      onToggle={(enabled) => setIsBiconomyToggledOn(enabled)}
                    />
                  </div>
                </div>
                {!isBiconomyAllowed && (
                  <CustomTooltip
                    id="whyGaslessDisabled"
                    text="Disabled for selected chain"
                  />
                )}
              </div>
              <div className="grid grid-cols-[1fr_34px_1fr] gap-2 p-4 rounded-xl bg-hyphen-purple bg-opacity-[0.05] border-hyphen-purple border border-opacity-10 hover:border-opacity-30">
                <NetworkSelectors />
              </div>
              <div className="grid grid-cols-[1fr_34px_1fr] items-center gap-2 p-4 rounded-xl bg-hyphen-purple bg-opacity-[0.05] border-hyphen-purple border border-opacity-10 hover:border-opacity-30">
                <AmountInput disabled={!areChainsReady} />
                <div></div>
                <TokenSelector disabled={!areChainsReady} />
              </div>

              <ChangeReceiverAddress />

              <CallToAction
                onApproveButtonClick={showApprovalModal}
                onTransferButtonClick={showTransferModal}
              />
            </div>
          </div>
          <TransactionFee />
        </div>
      </div>
    </>
  );
};

export default Home;
