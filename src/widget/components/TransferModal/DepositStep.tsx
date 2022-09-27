import arrowRight from 'assets/images/arrow-right.svg';
import loadingSpinner from 'assets/images/loading-spinner.svg';
import PrimaryButton from 'components/Buttons/PrimaryButton';
import { useTransaction } from 'context/Transaction';
import { useWalletProvider } from 'context/WalletProvider';
import { Status } from 'hooks/useLoading';
import { useEffect, useState } from 'react';
import { FiArrowUpRight } from 'react-icons/fi';
import { HiExclamation } from 'react-icons/hi';
import switchNetwork from 'utils/switchNetwork';
import TransferStatus from './TransferStatus';

interface IDepositStepProps {
  currentStepNumber: number;
  onNextStep: () => void;
  stepNumber: number;
  transferData: any;
  depositState: Status;
  setDepositState: (state: Status) => void;
  setModalErrored: (modalErrored: boolean) => void;
}

function DepositStep({
  currentStepNumber,
  depositState,
  stepNumber,
  setDepositState,
  onNextStep,
  setModalErrored,
  transferData,
}: IDepositStepProps) {
  const active = currentStepNumber === stepNumber;
  const { currentChainId, walletProvider } = useWalletProvider()!;
  const {
    executeDeposit,
    executeDepositStatus,
    executeDepositValue,
    executeDepositError,
    receiver: { receiverAddress },
  } = useTransaction()!;
  const { fromChain, selectedToken, toChain, transferAmount, transactionFee } =
    transferData;

  const [executed, setExecuted] = useState(false);

  useEffect(() => {
    if (active) {
      executeDeposit(receiverAddress);
      setExecuted(true);
    }
  }, [active, executeDeposit, receiverAddress]);

  useEffect(() => {
    if (executed && executeDepositError && active) setModalErrored(true);
  }, [executed, executeDepositError, setModalErrored, active]);

  useEffect(() => {
    if (executed && executeDepositStatus === Status.SUCCESS) {
      setDepositState(Status.PENDING);
      setExecuted(false);
      (async () => {
        await executeDepositValue.wait(1);
        setDepositState(Status.SUCCESS);
        onNextStep();
      })();
    }
  }, [
    executed,
    executeDepositStatus,
    onNextStep,
    setDepositState,
    executeDepositValue,
  ]);

  return (
    <>
      <article className="tw-hw-grid tw-hw-grid-cols-3">
        <div className="tw-hw-flex tw-hw-flex-col tw-hw-items-start">
          <div className="tw-hw-relative tw-hw-mb-3">
            <img
              className="tw-hw-h-10 tw-hw-w-10"
              src={fromChain?.image}
              alt={`Destination chain ${fromChain?.name}`}
            />
            <img
              className="tw-hw-absolute tw-hw-right-[-10px] tw-hw-top-[10px] tw-hw-h-5 tw-hw-w-5"
              src={selectedToken?.image}
              alt={`Selected token ${selectedToken?.symbol}`}
            />
          </div>
          <span className="tw-hw-text-left tw-hw-text-sm tw-hw-font-semibold tw-hw-text-hyphen-gray-400">
            {transferAmount} {selectedToken?.symbol}
          </span>
          <span className="tw-hw-mb-5 tw-hw-text-left tw-hw-text-sm tw-hw-font-semibold tw-hw-text-hyphen-gray-400">
            On {fromChain?.name}
          </span>
        </div>

        <div className="tw-hw-flex tw-hw-flex-col tw-hw-items-center tw-hw-justify-center">
          <img
            src={arrowRight}
            alt="Deposit direction"
            className="tw-hw-mb-8"
          />
          <img
            src={loadingSpinner}
            alt="Loading..."
            className="tw-hw-mx-auto tw-hw-h-10 tw-hw-w-10 tw-hw-animate-spin md:tw-hw-h-14 md:tw-hw-w-14"
          />
        </div>

        <div className="tw-hw-flex tw-hw-flex-col tw-hw-items-end">
          <div className="tw-hw-relative tw-hw-mb-3">
            <img
              className="tw-hw-h-10 tw-hw-w-10"
              src={toChain?.image}
              alt={`Destination chain ${toChain?.name}`}
            />
            <img
              className="tw-hw-absolute tw-hw-left-[-10px] tw-hw-top-[10px] tw-hw-h-5 tw-hw-w-5"
              src={selectedToken?.image}
              alt={`Selected token ${selectedToken?.symbol}`}
            />
          </div>
          <span className="tw-hw-text-right tw-hw-text-sm tw-hw-font-semibold tw-hw-text-hyphen-gray-400">
            {transactionFee?.amountToGetProcessedString} {selectedToken?.symbol}
          </span>
          <span className="tw-hw-mb-5 tw-hw-text-right tw-hw-text-sm tw-hw-font-semibold tw-hw-text-hyphen-gray-400">
            On {toChain?.name}
          </span>
        </div>
      </article>

      <div className="tw-hw-mb-[50px] tw-hw-flex tw-hw-items-center tw-hw-justify-between">
        {depositState === Status.PENDING || depositState === Status.SUCCESS ? (
          <button
            onClick={() => {
              window.open(
                `${fromChain?.explorerUrl}/tx/${executeDepositValue.hash}`,
                '_blank'
              );
            }}
            className="tw-hw-flex tw-hw-w-auto tw-hw-items-center tw-hw-rounded-full tw-hw-bg-hyphen-purple tw-hw-px-[10px] tw-hw-py-1 tw-hw-text-xxs tw-hw-font-bold tw-hw-uppercase tw-hw-text-white"
          >
            Source Tx
            <FiArrowUpRight className="tw-hw-h-3 tw-hw-w-3" />
          </button>
        ) : (
          <button
            disabled
            className="tw-hw-flex tw-hw-w-auto tw-hw-items-center tw-hw-rounded-full tw-hw-bg-hyphen-gray-300 tw-hw-px-[10px] tw-hw-py-1 tw-hw-text-xxs tw-hw-font-bold tw-hw-uppercase tw-hw-text-white"
          >
            Source Tx
            <FiArrowUpRight className="tw-hw-h-3 tw-hw-w-3" />
          </button>
        )}
        <button
          disabled
          className="tw-hw-flex tw-hw-w-auto tw-hw-items-center tw-hw-rounded-full tw-hw-bg-hyphen-gray-300 tw-hw-px-[10px] tw-hw-py-1 tw-hw-text-xxs tw-hw-font-bold tw-hw-uppercase tw-hw-text-white"
        >
          Exit Tx
          <FiArrowUpRight className="tw-hw-h-3 tw-hw-w-3" />
        </button>
      </div>

      {fromChain.chainId !== currentChainId ? (
        // <PrimaryButton
        //   className="tw-hw-mb-3"
        //   onClick={() => {
        //     if (!walletProvider || !fromChain)
        //       throw new Error('Prerequisites missing');
        //     switchNetwork(walletProvider, fromChain);
        //   }}
        // >
        //   Switch to {fromChain?.name}
        // </PrimaryButton>
        <TransferStatus>
          <span className="tw-hw-text-hyphen-gray-400">Bridging paused...</span>
        </TransferStatus>
      ) : null}

      {executeDepositError && fromChain.chainId === currentChainId ? (
        <TransferStatus>
          <span className="tw-hw-text-red-400">
            {executeDepositError?.message || executeDepositError.toString()}
          </span>
        </TransferStatus>
      ) : null}

      {fromChain.chainId === currentChainId &&
      executeDepositStatus === Status.PENDING ? (
        <TransferStatus>
          <span className="tw-hw-text-hyphen-gray-400">
            Approve transaction...
          </span>
        </TransferStatus>
      ) : null}

      {fromChain.chainId === currentChainId &&
      executeDepositStatus === Status.SUCCESS ? (
        <TransferStatus>
          <span className="tw-hw-text-hyphen-gray-400">
            Bridging in progress...
          </span>
        </TransferStatus>
      ) : null}

      {fromChain.chainId === currentChainId ? (
        <article className="tw-hw-flex tw-hw-items-center tw-hw-justify-center tw-hw-rounded-[10px] tw-hw-bg-red-300 tw-hw-bg-opacity-25 tw-hw-p-2 tw-hw-text-red-700">
          <HiExclamation className="tw-hw-mr-3 tw-hw-h-3 tw-hw-w-3" />
          <p className="tw-hw-text-left tw-hw-text-xxs tw-hw-font-bold tw-hw-uppercase">
            Please do not refresh or change network.
          </p>
        </article>
      ) : (
        <article className="tw-hw-flex tw-hw-items-center tw-hw-justify-center tw-hw-rounded-[10px] tw-hw-bg-red-300 tw-hw-bg-opacity-25 tw-hw-p-2 tw-hw-text-red-700">
          <HiExclamation className="tw-hw-mr-3 tw-hw-h-3 tw-hw-w-3" />
          <p className="tw-hw-text-left tw-hw-text-xxs tw-hw-font-bold tw-hw-uppercase">
            Your wallet's network seems to have been changed. Please check the
            network.
          </p>
        </article>
      )}
    </>
  );
}

export default DepositStep;
