import React, { useEffect, useState } from "react";

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
import { useTransaction } from "../context/Transaction";
import { useBiconomy } from "../context/Biconomy";
import CustomTooltip from "../components/CustomTooltip";
import { HiInformationCircle } from "react-icons/hi";
import { HyphenWidgetOptions } from "../";
import { useToken } from "../context/Token";
import { useHyphen } from "../context/Hyphen";
import HyphenLogoDark from "assets/images/hyphen-logo-dark.svg";
import WidgetBranding from "assets/images/widget-branding.svg";
import { IoMdClose } from "react-icons/io";

interface IWidgetProps {
  closeWidget: () => void;
}

const Widget: React.FC<HyphenWidgetOptions & IWidgetProps> = (props) => {
  const { areChainsReady, fromChain, toChain, toChainRpcUrlProvider } =
    useChains()!;
  const {
    transferAmount,
    changeTransferAmountInputValue,
    executeDepositValue,
    exitHash,
    transactionFee,
  } = useTransaction()!;

  useEffect(() => {
    if (executeDepositValue?.hash && props.onDeposit)
      props.onDeposit(executeDepositValue?.hash);
  }, [executeDepositValue?.hash, props, props.onDeposit]);

  useEffect(() => {
    if (exitHash && props.onExit) props.onExit(exitHash);
  }, [exitHash, props, props.onExit]);

  const { isBiconomyAllowed, setIsBiconomyToggledOn, isBiconomyEnabled } =
    useBiconomy()!;
  const { selectedToken } = useToken()!;
  const { isLoggedIn, connect } = useWalletProvider()!;
  const { poolInfo } = useHyphen()!;
  const { executeApproveTokenError, executeApproveToken } = useTokenApproval()!;

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

  const [transferModalData, setTransferModalData] = useState<any>();

  function handleTransferButtonClick() {
    const updatedTransferModalData = {
      fromChain,
      selectedToken,
      toChain,
      toChainRpcUrlProvider,
      transferAmount,
      transactionFee,
    };

    setTransferModalData(updatedTransferModalData);
    showTransferModal();
  }

  useEffect(() => {
    (async () => {
      await connect().catch((e) => {
        console.error(e);
      });
    })();
  }, [isLoggedIn, connect]);

  return (
    <>
      {fromChain && selectedToken && transferAmount ? (
        <ApprovalModal
          executeTokenApproval={executeApproveToken}
          isVisible={isApprovalModalVisible}
          onClose={hideApprovalModal}
          selectedChainName={fromChain.name}
          selectedTokenName={selectedToken.symbol}
          transferAmount={transferAmount}
        />
      ) : null}

      {isTransferModalVisible ? (
        <TransferModal
          isVisible={isTransferModalVisible}
          onClose={() => {
            changeTransferAmountInputValue("");
            hideTransferlModal();
          }}
          transferModalData={transferModalData}
        />
      ) : null}

      <ErrorModal error={executeApproveTokenError} title={"Approval Error"} />
      <div className="max-w-xl">
        <div className="flex flex-col gap-2 rounded-10 bg-white p-6 shadow-[0_4px_15px_rgba(0,0,0,0.5)]">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex flex-col items-center">
              <img
                src={HyphenLogoDark}
                className="h-6 w-auto"
                alt="Hyphen Logo"
              />
              <img
                src={WidgetBranding}
                alt="Powered by biconomy"
                className="ml-4 mt-2"
              />
            </div>
            <div className="flex">
              <div className="flex items-center">
                <HiInformationCircle
                  data-tip
                  data-for="gaslessMode"
                  className="mr-2 text-gray-500"
                />
                <CustomTooltip id="gaslessMode">
                  <span>This transaction is sponsored by Biconomy</span>
                </CustomTooltip>
                <div
                  className={
                    !isBiconomyAllowed
                      ? "flex items-center cursor-not-allowed opacity-50"
                      : "flex items-center"
                  }
                  data-tip
                  data-for="whyGaslessDisabled"
                >
                  <span className="mr-2 text-xxs font-semibold text-hyphen-gray-400 uppercase">
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
                <CustomTooltip id="whyGaslessDisabled">
                  <span>Disabled for selected chain</span>
                </CustomTooltip>
              )}
              {props.showCloseButton ? (
                <button
                  className="rounded hover:bg-gray-100 ml-4"
                  onClick={props.closeWidget}
                >
                  <IoMdClose className="h-6 w-auto text-gray-500" />
                </button>
              ) : null}
            </div>
          </div>
          <div className="grid grid-cols-[1fr_34px_1fr] gap-2 rounded-xl border border-hyphen-purple border-opacity-10 bg-hyphen-purple bg-opacity-[0.05] p-4 hover:border-opacity-30">
            <NetworkSelectors
              allowedSourceChains={props.allowedSourceChains}
              allowedDestinationChains={props.allowedDestinationChains}
            />
          </div>
          <div className="grid grid-cols-2 items-center gap-12 rounded-xl border border-hyphen-purple border-opacity-10 bg-hyphen-purple bg-opacity-[0.05] p-4 hover:border-opacity-30">
            <AmountInput
              disabled={
                !areChainsReady ||
                !poolInfo?.minDepositAmount ||
                !poolInfo?.maxDepositAmount
              }
            />
            <TokenSelector
              allowedTokens={props.allowedTokens}
              disabled={
                !areChainsReady ||
                !poolInfo?.minDepositAmount ||
                !poolInfo?.maxDepositAmount
              }
            />
          </div>

          {props.showChangeAddress ? <ChangeReceiverAddress /> : null}

          <CallToAction
            onApproveButtonClick={showApprovalModal}
            onTransferButtonClick={handleTransferButtonClick}
          />
        </div>

        <TransactionFee />
      </div>
    </>
  );
};

export default Widget;
