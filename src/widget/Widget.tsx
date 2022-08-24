import React, { useEffect, useState } from 'react';

import { useChains } from '../context/Chains';
import { useWalletProvider } from '../context/WalletProvider';

import HyphenLogoDark from 'assets/images/hyphen-logo-dark.svg';
import WidgetBranding from 'assets/images/widget-branding.svg';
import { HiInformationCircle } from 'react-icons/hi';
import { IoMdClose } from 'react-icons/io';
import { HyphenWidgetOptions } from '../';
import CustomTooltip from '../components/CustomTooltip';
import { Toggle } from '../components/Toggle';
import { useBiconomy } from '../context/Biconomy';
import { useHyphen } from '../context/Hyphen';
import { useToken } from '../context/Token';
import { useTokenApproval } from '../context/TokenApproval';
import { useTransaction } from '../context/Transaction';
import useModal from '../hooks/useModal';
import AmountInput from './components/AmountInput';
import ApprovalModal from './components/ApprovalModal';
import CallToAction from './components/CallToAction';
import ChangeReceiverAddress from './components/ChangeReceiverAddress';
import ErrorModal from './components/ErrorModal';
import GasTokenSwap from './components/GasTokenSwap';
import NetworkSelectors from './components/NetworkSelectors';
import TokenSelector from './components/TokenSelector';
import TransactionFee from './components/TransactionFee';
import TransferModal from './components/TransferModal';

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
            changeTransferAmountInputValue('');
            hideTransferlModal();
          }}
          transferModalData={transferModalData}
        />
      ) : null}

      <ErrorModal error={executeApproveTokenError} title={'Approval Error'} />
      <div className="w-auto">
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
              {props.showCloseButton ? (
                <button
                  className="ml-4 rounded hover:bg-gray-100"
                  onClick={props.closeWidget}
                >
                  <IoMdClose className="h-6 w-auto text-gray-500" />
                </button>
              ) : null}
            </div>
          </div>

          <NetworkSelectors
            allowedSourceChains={props.allowedSourceChains}
            allowedDestinationChains={props.allowedDestinationChains}
          />

          <div className="grid grid-cols-[332px_166px] items-center gap-0 rounded-[20px] bg-bridge-section p-5">
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

          {props.showGasTokenSwap ? <GasTokenSwap /> : null}

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
