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
import { HyphenWidgetOptions, InputConfig, Inputs } from "../";
import { useToken } from "../context/Token";
import { useHyphen } from "../context/Hyphen";
export interface WidgetProps {
  sourceChain: string | undefined;
  destinationChain: string | undefined;
  token: string;
  amount: string;
  receiver: string;
  gasless: boolean;

  lockSourceChain?: boolean;
  lockDestinationChain?: boolean;
  lockToken?: boolean;
  lockAmount?: boolean;
  lockReceiver?: boolean;
}

interface WidgetSetFunctions {
  setSourceChain: (newValue: string) => void;
  setDestinationChain: (newValue: string | undefined) => void;
  setToken: (newValue: string) => void;
  setAmount: (newValue: string) => void;
  setReceiver: (newValue: string) => void;
  setGasless: (newValue: boolean) => void;
}

const Widget: React.FC<
  HyphenWidgetOptions & WidgetSetFunctions & Inputs & InputConfig
> = (props) => {
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

  const [state, setState] = useState<HyphenWidgetOptions & WidgetProps>({
    env: props.env,
    apiKeys: props.apiKeys,
    rpcUrls: props.rpcUrls,
    popupMode: props.popupMode,
    widgetMode: props.widgetMode,
    lockSourceChain: props.lockSourceChain,
    lockDestinationChain: props.lockDestinationChain,
    lockToken: props.lockToken,
    lockAmount: props.lockAmount,
    lockReceiver: props.lockReceiver,
    sourceChain: props.defaultSourceChain || props.sourceChain,
    destinationChain: props.defaultDestinationChain || props.destinationChain,
    token: props.defaultToken || props.token || "ETH",
    amount: props.defaultAmount || props.amount || "",
    receiver: props.defaultReceiver || props.receiver || "",
    gasless: props.defaultGaslessMode || props.gasless || false,
  });

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
    setState({
      env: props.env,
      apiKeys: props.apiKeys,
      rpcUrls: props.rpcUrls,
      popupMode: props.popupMode,
      widgetMode: props.widgetMode,
      lockSourceChain: props.lockSourceChain,
      lockDestinationChain: props.lockDestinationChain,
      lockToken: props.lockToken,
      lockAmount: props.lockAmount,
      lockReceiver: props.lockReceiver,
      sourceChain: props.defaultSourceChain || props.sourceChain,
      destinationChain: props.defaultDestinationChain || props.destinationChain,
      token: props.defaultToken || props.token || "ETH",
      amount: props.defaultAmount || props.amount || "",
      receiver: props.defaultReceiver || props.receiver || "",
      gasless: props.defaultGaslessMode || props.gasless || false,
    });
  }, [props]);

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
        <div className="relative z-10">
          <div className="flex flex-col gap-2 rounded-10 bg-white p-6 shadow-lg">
            <div className="mb-2 flex items-center justify-end">
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
                      ? "flex cursor-not-allowed opacity-50"
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
                <CustomTooltip id="whyGaslessDisabled">
                  <span>Disabled for selected chain</span>
                </CustomTooltip>
              )}
            </div>
            <div className="grid grid-cols-[1fr_34px_1fr] gap-2 rounded-xl border border-hyphen-purple border-opacity-10 bg-hyphen-purple bg-opacity-[0.05] p-4 hover:border-opacity-30">
              <NetworkSelectors />
            </div>
            <div className="grid grid-cols-2 items-center gap-12 rounded-xl border border-hyphen-purple border-opacity-10 bg-hyphen-purple bg-opacity-[0.05] p-4 hover:border-opacity-30">
              <AmountInput
                disabled={
                  state.lockAmount ||
                  !areChainsReady ||
                  !poolInfo?.minDepositAmount ||
                  !poolInfo?.maxDepositAmount
                }
              />
              <TokenSelector
                disabled={
                  !areChainsReady ||
                  !poolInfo?.minDepositAmount ||
                  !poolInfo?.maxDepositAmount
                }
              />
            </div>

            <ChangeReceiverAddress />

            <CallToAction
              onApproveButtonClick={showApprovalModal}
              onTransferButtonClick={handleTransferButtonClick}
            />
          </div>
        </div>
        <TransactionFee />
      </div>
    </>
  );
};

export default Widget;
