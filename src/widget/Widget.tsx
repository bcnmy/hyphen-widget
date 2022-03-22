import React, { useEffect, useMemo, useState } from 'react';

import { useWalletProvider } from '../context/WalletProvider';
import { useChains } from '../context/Chains';

import NetworkSelectors from './components/NetworkSelectors';
import TokenSelector from './components/TokenSelector';
import AmountInput from './components/AmountInput';
import TransactionFee from './components/TransactionFee';
import ChangeReceiverAddress from './components/ChangeReceiverAddress';
import CallToAction from './components/CallToAction';
import { Toggle } from '../components/Toggle';
import useModal from '../hooks/useModal';
import ApprovalModal from './components/ApprovalModal';
import { useTokenApproval } from '../context/TokenApproval';
import ErrorModal from './components/ErrorModal';
import TransferModal from './components/TransferModal';
import { useTransaction } from '../context/Transaction';
import { useBiconomy } from '../context/Biconomy';
import CustomTooltip from './components/CustomTooltip';
import { HiInformationCircle } from 'react-icons/hi';
import { HyphenWidgetOptions, InputConfig, Inputs } from '../';
import { useToken } from '../context/Token';
import { TokenConfig } from '../config/tokens';
import { ChainConfig } from '../config/chains';

export interface WidgetProps {
  sourceChain: string;
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
  const {
    chainsList,
    areChainsReady,
    fromChain,
    toChain,
    changeFromChain,
    changeToChain,
    switchChains,
    compatibleToChainsForCurrentFromChain,
  } = useChains()!;
  const {
    changeTransferAmountInputValue,
    transactionAmountValidationErrors,
    changeReceiver,
    receiver,
  } = useTransaction()!;
  const { isBiconomyAllowed, setIsBiconomyToggledOn, isBiconomyEnabled } =
    useBiconomy()!;
  const { tokensList, changeSelectedToken } = useToken()!;
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
    sourceChain: props.defaultSourceChain || props.sourceChain || 'Mumbai',
    destinationChain:
      props.defaultDestinationChain || props.destinationChain || 'Goerli',
    token: props.defaultToken || props.token || 'ETH',
    amount: props.defaultAmount || props.amount || '',
    receiver: props.defaultReceiver || props.receiver || '',
    gasless: props.defaultGaslessMode || props.gasless || false,
  });

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
      sourceChain: props.defaultSourceChain || props.sourceChain || 'Mumbai',
      destinationChain:
        props.defaultDestinationChain || props.destinationChain || 'Goerli',
      token: props.defaultToken || props.token || 'ETH',
      amount: props.defaultAmount || props.amount || '',
      receiver: props.defaultReceiver || props.receiver || '',
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
    (async () => {
      await connect().catch((e) => {
        console.error(e);
      });
    })();
  }, [isLoggedIn, connect]);

  useEffect(() => {
    setIsBiconomyToggledOn(!!state.gasless);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.gasless]);

  useEffect(() => {
    changeTransferAmountInputValue(state.amount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.amount]);

  useEffect(() => {
    setFunctions.setAmount('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.sourceChain, state.destinationChain, state.token]);

  useEffect(() => {
    fromChain &&
      changeSelectedToken(
        tokensList.find((t) => t.symbol === state.token) as TokenConfig
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.token]);

  useEffect(() => {
    if (
      fromChain?.name === state.destinationChain &&
      toChain?.name === state.sourceChain
    )
      return switchChains();
    if (!chainsList) return;

    if (fromChain?.name !== state.sourceChain) {
      changeFromChain(
        chainsList.find((e) => e.name === state.sourceChain) as ChainConfig
      );
      setFunctions.setDestinationChain(undefined);
    } else if (toChain?.name !== state.destinationChain) {
      if (
        compatibleToChainsForCurrentFromChain?.find(
          (e) => e.name === state.destinationChain
        )
      ) {
        changeToChain(
          chainsList.find(
            (e) => e.name === state.destinationChain
          ) as ChainConfig
        );
      } else {
        setFunctions.setDestinationChain(undefined);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.destinationChain, state.sourceChain]);

  useEffect(() => {
    changeReceiver({
      currentTarget: { value: state.receiver },
    } as React.FormEvent<HTMLInputElement>);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.receiver]);

  return (
    <>
      <ApprovalModal
        isVisible={isApprovalModalVisible}
        onClose={hideApprovalModal}
      />
      <TransferModal
        isVisible={isTransferModalVisible}
        onClose={() => {
          changeTransferAmountInputValue('');
          hideTransferlModal();
        }}
      />
      <ErrorModal error={executeApproveTokenError} title={'Approval Error'} />
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
                        ? 'flex opacity-50 cursor-not-allowed'
                        : 'flex'
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
                      onToggle={(enabled) => setFunctions.setGasless(enabled)}
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
                <NetworkSelectors
                  setFromChain={setFunctions.setSourceChain}
                  setToChain={setFunctions.setDestinationChain}
                  swapFromToChains={() => {
                    if (!state.destinationChain) return;
                    setFunctions.setSourceChain(state.destinationChain);
                    setFunctions.setDestinationChain(state.sourceChain);
                  }}
                />
              </div>
              <div className="grid grid-cols-[1fr_34px_1fr] items-center gap-2 p-4 rounded-xl bg-hyphen-purple bg-opacity-[0.05] border-hyphen-purple border border-opacity-10 hover:border-opacity-30">
                <AmountInput
                  disabled={state.lockAmount || !areChainsReady}
                  amount={state.amount}
                  setAmount={setFunctions.setAmount}
                  error={transactionAmountValidationErrors}
                />
                <div></div>
                <TokenSelector
                  disabled={state.lockToken || !areChainsReady}
                  token={state.token}
                  setAmount={setFunctions.setAmount}
                  setToken={setFunctions.setToken}
                />
              </div>

              <ChangeReceiverAddress setReceiver={setFunctions.setReceiver} />

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

export default Widget;
