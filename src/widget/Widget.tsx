import React, { useEffect, useState } from 'react';

import { useChains } from '../context/Chains';
import { useWalletProvider } from '../context/WalletProvider';

import HyphenLogoDark from 'assets/images/hyphen-logo-dark.svg';
import WidgetBranding from 'assets/images/widget-branding.svg';
import { HiExclamation } from 'react-icons/hi';
import { IoMdClose } from 'react-icons/io';
import isToChainEthereum from 'utils/isToChainEthereum';
import { HyphenWidgetOptions } from '../';
import { useHyphen } from '../context/Hyphen';
import { useToken } from '../context/Token';
import { useTokenApproval } from '../context/TokenApproval';
import { useTransaction } from '../context/Transaction';
import useModal from '../hooks/useModal';
import AmountInput from './components/AmountInput';
import ApprovalModal from './components/ApprovalModal';
import BridgeOptions from './components/BridgeOptions';
import CallToAction from './components/CallToAction';
import ErrorModal from './components/ErrorModal';
import NetworkSelectors from './components/NetworkSelectors';
import ReceiveMinimum from './components/ReceiveMinimum';
import TokenSelector from './components/TokenSelector';
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

  const showEthereumDisclaimer = toChain
    ? isToChainEthereum(toChain.chainId)
    : false;

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
      <div className="flex w-auto flex-col gap-2 bg-white p-6 md:rounded-[25px] md:shadow-[0_24px_50px_rgba(229,229,229,0.75)]">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={HyphenLogoDark}
              className="mr-5 h-6 w-auto"
              alt="Hyphen Logo"
            />
            <img
              src={WidgetBranding}
              alt="Powered by biconomy"
              className="mt-1"
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

        <div className="grid grid-cols-[1.5fr_1fr] items-center gap-0 rounded-[20px] bg-bridge-section p-5 sm:grid-cols-[2fr_1fr]">
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

        <ReceiveMinimum />

        <BridgeOptions
          showChangeAddress={props.showChangeAddress}
          showGasTokenSwap={props.showGasTokenSwap}
        />

        <CallToAction
          onApproveButtonClick={showApprovalModal}
          onTransferButtonClick={handleTransferButtonClick}
        />

        {showEthereumDisclaimer ? (
          <article className="mt-0.5 flex h-8 items-center justify-center rounded-[10px] bg-hyphen-warning/25 px-8 text-xxxs font-bold uppercase text-hyphen-warning xl:h-9 xl:text-xxs">
            <HiExclamation className="mr-2 h-2.5 w-auto" />
            <p>
              The received amount may differ due to gas price fluctuations on
              Ethereum.
            </p>
          </article>
        ) : null}
      </div>
    </>
  );
};

export default Widget;
