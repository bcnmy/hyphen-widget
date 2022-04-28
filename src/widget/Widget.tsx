import React, { useEffect, useMemo, useState } from "react";

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
import { TokenConfig } from "../config/tokens";
import { ChainConfig } from "../config/chains";
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
  const [firstLoad, setFirstLoad] = useState(0);
  const {
    chainsList,
    areChainsReady,
    fromChain,
    toChain,
    changeFromChain,
    changeToChain,
    switchChains,
    compatibleToChainsForCurrentFromChain,
    toChainRpcUrlProvider,
  } = useChains()!;
  const {
    transferAmount,
    changeTransferAmountInputValue,
    transactionAmountValidationErrors,
    changeReceiver,
    receiver,
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
  const {
    tokensList,
    compatibleTokensForCurrentChains,
    changeSelectedToken,
    selectedToken,
  } = useToken()!;
  const { isLoggedIn, connect } = useWalletProvider()!;
  const { poolInfo } = useHyphen()!;

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
  const { executeApproveTokenError, executeApproveToken } = useTokenApproval()!;

  const [state, setState] = useState<HyphenWidgetOptions & WidgetProps>({
    test: props.test,
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
      test: props.test,
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

  const setFunctions: WidgetSetFunctions = useMemo(() => {
    let isDefaultMode = !(
      props.sourceChain ||
      props.destinationChain ||
      props.token ||
      props.amount ||
      props.receiver ||
      props.gasless
    );

    return {
      setSourceChain: isDefaultMode
        ? (newValue) => setState((prev) => ({ ...prev, sourceChain: newValue }))
        : props.setSourceChain,
      setDestinationChain: isDefaultMode
        ? (newValue) =>
            setState((prev) => ({ ...prev, destinationChain: newValue }))
        : props.setDestinationChain,
      setToken: isDefaultMode
        ? (newValue) => setState((prev) => ({ ...prev, token: newValue }))
        : props.setToken,
      setAmount: isDefaultMode
        ? (newValue) => setState((prev) => ({ ...prev, amount: newValue }))
        : props.setAmount,
      setReceiver: isDefaultMode
        ? (newValue) => setState((prev) => ({ ...prev, receiver: newValue }))
        : props.setReceiver,
      setGasless: isDefaultMode
        ? (newValue) => setState((prev) => ({ ...prev, gasless: newValue }))
        : props.setGasless,
    };
  }, [
    props.amount,
    props.destinationChain,
    props.gasless,
    props.receiver,
    props.setAmount,
    props.setDestinationChain,
    props.setGasless,
    props.setReceiver,
    props.setSourceChain,
    props.setToken,
    props.sourceChain,
    props.token,
  ]);
  useEffect(() => {
    if (props.onChange) {
      props.onChange({
        amount: transferAmount?.toString(),
        destinationChain: toChain?.name,
        gasless: isBiconomyEnabled,
        receiver: receiver.receiverAddress,
        sourceChain: fromChain?.name,
        token: selectedToken?.symbol,
      });
    }
  }, [
    fromChain?.name,
    isBiconomyEnabled,
    props,
    receiver.receiverAddress,
    selectedToken?.symbol,
    toChain?.name,
    transferAmount,
  ]);

  useEffect(() => {
    (async () => {
      await connect().catch((e) => {
        console.error(e);
      });
    })();
  }, [isLoggedIn, connect]);

  // useEffect(() => {
  //   setIsBiconomyToggledOn(!!state.gasless);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [state.gasless]);

  // useEffect(() => {
  //   changeTransferAmountInputValue(state.amount);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [state.amount]);

  // useEffect(() => {
  //   if (firstLoad === 3) setFunctions.setAmount("");
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [state.sourceChain, state.destinationChain, state.token]);

  // useEffect(() => {
  //   fromChain &&
  //     changeSelectedToken(
  //       tokensList.find((t) => t.symbol === state.token) as TokenConfig
  //     );
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [state.token]);

  // useEffect(() => {
  //   if (
  //     fromChain?.name === state.destinationChain &&
  //     toChain?.name === state.sourceChain
  //   )
  //     return switchChains();
  //   if (!chainsList) return;

  //   if (fromChain?.name !== state.sourceChain) {
  //     changeFromChain(
  //       chainsList.find((e) => e.name === state.sourceChain) as ChainConfig
  //     );
  //     if (firstLoad) {
  //       setFunctions.setDestinationChain(undefined);
  //     }
  //   } else if (toChain?.name !== state.destinationChain) {
  //     if (
  //       compatibleToChainsForCurrentFromChain?.find(
  //         (e) => e.name === state.destinationChain
  //       )
  //     ) {
  //       changeToChain(
  //         chainsList.find(
  //           (e) => e.name === state.destinationChain
  //         ) as ChainConfig
  //       );
  //     } else if (firstLoad) {
  //       setFunctions.setDestinationChain(undefined);
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [state.destinationChain, state.sourceChain]);

  // useEffect(() => {
  //   changeReceiver({
  //     currentTarget: { value: state.receiver },
  //   } as React.FormEvent<HTMLInputElement>);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [state.receiver]);

  // useEffect(() => {
  //   if (
  //     firstLoad === 0 &&
  //     !toChain &&
  //     chainsList &&
  //     compatibleToChainsForCurrentFromChain
  //   ) {
  //     state.destinationChain &&
  //       changeToChain(
  //         chainsList.find(
  //           (e) => e.name === state.destinationChain
  //         ) as ChainConfig
  //       );
  //     setFirstLoad(1);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [
  //   chainsList,
  //   firstLoad,
  //   toChain,
  //   state.destinationChain,
  //   compatibleToChainsForCurrentFromChain,
  // ]);

  // useEffect(() => {
  //   if (
  //     firstLoad === 1 &&
  //     toChain &&
  //     compatibleTokensForCurrentChains &&
  //     areChainsReady
  //   ) {
  //     state.token &&
  //       changeSelectedToken(
  //         tokensList.find((t) => t.symbol === state.token) as TokenConfig
  //       );
  //     changeTransferAmountInputValue(state.amount);
  //     setFirstLoad(2);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [firstLoad, state.token, toChain, tokensList, areChainsReady]);

  // useEffect(() => {
  //   if (firstLoad === 2 && fromChain && toChain && selectedToken) {
  //     changeTransferAmountInputValue(state.amount);
  //     setFirstLoad(3);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [firstLoad, fromChain, selectedToken, state.amount, toChain]);

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
      <div className="mb-24">
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
      </div>
    </>
  );
};

export default Widget;
