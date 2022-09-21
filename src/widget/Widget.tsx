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
import config from 'config';
import { BigNumber, ethers } from 'ethers';
import { FiMinus, FiPlus } from 'react-icons/fi';

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
    gasTokenSwapData,
    transactionFee,
  } = useTransaction()!;

  useEffect(() => {
    if (executeDepositValue?.hash && props.onDeposit)
      props.onDeposit(executeDepositValue?.hash);
  }, [executeDepositValue?.hash, props, props.onDeposit]);

  useEffect(() => {
    if (exitHash && props.onExit) props.onExit(exitHash);
  }, [exitHash, props, props.onExit]);

  const { selectedToken, tokens } = useToken()!;
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

  const { gasTokenPercentage } = gasTokenSwapData ?? {};
  let gasTokenMsgOnInput;
  let gasTokenMsgOnOutput;
  if (
    gasTokenPercentage !== undefined &&
    (gasTokenPercentage === 0 || gasTokenPercentage > 80)
  ) {
    gasTokenMsgOnInput = `Not enough funds to get ${ethers.utils.formatUnits(
      BigNumber.from(toChain?.gasTokenSwap.gasTokenAmount),
      toChain?.nativeDecimal
    )} ${toChain?.nativeToken} on ${toChain?.name}`;
  } else if (
    gasTokenPercentage !== undefined &&
    gasTokenPercentage > 0 &&
    gasTokenPercentage <= 80
  ) {
    gasTokenMsgOnInput = `~${gasTokenSwapData.gasTokenPercentage.toFixed(
      3
    )}% of ${transferAmount} ${selectedToken?.symbol} will be swapped for gas`;

    gasTokenMsgOnOutput = `~${ethers.utils.formatUnits(
      BigNumber.from(toChain?.gasTokenSwap.gasTokenAmount),
      toChain?.nativeDecimal
    )} ${toChain?.currency} on ${toChain?.name}`;
  }

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
      <div className="tw-hw-flex tw-hw-w-auto tw-hw-flex-col tw-hw-gap-8 tw-hw-bg-white tw-hw-p-6 md:tw-hw-rounded-[25px] md:tw-hw-shadow-[0_24px_50px_rgba(0,0,0,0.25)]">
        {props.tag !== config.constants.DEPOSIT_TAG ? (
          <div className="tw-hw-mb-2 tw-hw-flex tw-hw-items-center tw-hw-justify-between">
            <div className="tw-hw-flex tw-hw-flex-col tw-hw-items-center md:tw-hw-flex-row">
              <img
                src={HyphenLogoDark}
                className="tw-hw-mr-5 tw-hw-h-6 tw-hw-w-auto"
                alt="Hyphen Logo"
              />
              <img
                src={WidgetBranding}
                alt="Powered by biconomy"
                className="tw-hw-mt-3 md:tw-hw-mt-1"
              />
            </div>
            <div className="tw-hw-flex">
              {props.showCloseButton ? (
                <button
                  className="tw-hw-ml-4 tw-hw-rounded hover:tw-hw-bg-gray-100"
                  onClick={props.closeWidget}
                >
                  <IoMdClose className="tw-hw-h-6 tw-hw-w-auto tw-hw-text-gray-500" />
                </button>
              ) : null}
            </div>
          </div>
        ) : null}

        <NetworkSelectors
          allowedSourceChains={props.allowedSourceChains}
          allowedDestinationChains={props.allowedDestinationChains}
        />

        <div className="tw-hw-grid tw-hw-grid-cols-1 tw-hw-items-center tw-hw-gap-3 md:tw-hw-grid-cols-[2fr_1fr] md:tw-hw-gap-0">
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
          {gasTokenMsgOnInput ? (
            <span className="-tw-hw-ml-0.5 tw-hw-flex tw-hw-items-center tw-hw-pl-5 tw-hw-text-xxs tw-hw-font-semibold tw-hw-text-red-700 md:tw-hw-mt-2">
              <FiMinus className="tw-hw-mr-1 tw-hw-h-3 tw-hw-w-3" />
              {gasTokenMsgOnInput}
            </span>
          ) : null}
        </div>

        <div className="tw-hw-relative tw-hw-grid tw-hw-grid-cols-1 tw-hw-items-center tw-hw-gap-5 md:tw-hw-grid-cols-[2fr_1fr] md:tw-hw-gap-0">
          <ReceiveMinimum />
          {gasTokenMsgOnOutput ? (
            <span className="-tw-hw-ml-0.5 tw-hw-flex tw-hw-items-center tw-hw-pl-5 tw-hw-text-xxs tw-hw-font-semibold tw-hw-text-emerald-700 md:tw-hw-mt-2">
              <FiPlus className="tw-hw-mr-1 tw-hw-h-3 tw-hw-w-3" />
              {gasTokenMsgOnOutput}
            </span>
          ) : null}
        </div>

        <BridgeOptions
          showChangeAddress={props.showChangeAddress}
          showGasTokenSwap={props.showGasTokenSwap}
        />

        <CallToAction
          onApproveButtonClick={showApprovalModal}
          onTransferButtonClick={handleTransferButtonClick}
        />

        {showEthereumDisclaimer ? (
          <article className="tw-hw-mt-0.5 tw-hw-flex tw-hw-h-auto tw-hw-items-center tw-hw-justify-center tw-hw-rounded-[10px] tw-hw-bg-hyphen-warning/25 tw-hw-px-8 tw-hw-py-2 tw-hw-text-xxxs tw-hw-font-bold tw-hw-uppercase tw-hw-text-hyphen-warning md:tw-hw-text-xxs">
            <HiExclamation className="tw-hw-mr-2 tw-hw-h-2.5 tw-hw-w-auto" />
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
