import { formatDistanceStrict } from 'date-fns';
import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { useToken } from 'context/Token';
import { useTransaction } from 'context/Transaction';
import { Status } from 'hooks/useLoading';
import {
  HiExclamation,
  HiInformationCircle,
  HiOutlineArrowSmRight,
} from 'react-icons/hi';
// import { MANUAL_EXIT_RETRIES } from "../../../../config/constants";
import arrowRight from 'assets/images/arrow-right.svg';
import bridgingCompleteArrow from 'assets/images/bridging-complete-arrow.svg';
import loadingSpinner from 'assets/images/loading-spinner.svg';
import CustomTooltip from 'components/CustomTooltip';
import { FiArrowUpRight } from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';

export interface ITransferModalProps {
  isVisible: boolean;
  onClose: () => void;
  transferModalData: any;
}

interface Step {
  currentStepNumber: number;
  onNextStep: () => void;
  stepNumber: number;
  transferModalData: any;
}

const PreDepositStep: React.FC<
  Step & { setModalErrored: (modalErrored: boolean) => void }
> = ({
  currentStepNumber,
  stepNumber,
  onNextStep,
  setModalErrored,
  transferModalData,
}) => {
  const active = currentStepNumber === stepNumber;

  // we set this to true after this step is executed
  // this is done so that stale values of value and error are not used
  const [executed, setExecuted] = useState(false);

  const {
    executePreDepositCheck,
    executePreDepositCheckError,
    executePreDepositCheckStatus,
  } = useTransaction()!;

  useEffect(() => {
    if (active) {
      executePreDepositCheck();
      setExecuted(true);
    }
  }, [active, executePreDepositCheck]);

  useEffect(() => {
    if (executed && executePreDepositCheckError && active)
      setModalErrored(true);
  }, [executed, executePreDepositCheckError, active, setModalErrored]);

  useEffect(() => {
    if (executed && executePreDepositCheckStatus === Status.SUCCESS && active) {
      onNextStep();
      setExecuted(false);
    }
  }, [executed, executePreDepositCheckStatus, onNextStep, active]);

  return (
    <>
      <img
        src={loadingSpinner}
        alt="Loading..."
        className="tw-hw-mx-auto tw-hw-mb-[58px] tw-hw-animate-spin"
      />
      <span className="tw-hw-mb-3 tw-hw-block tw-hw-w-full tw-hw-rounded-[10px] tw-hw-bg-hyphen-gray-300 tw-hw-bg-opacity-25 tw-hw-py-4 tw-hw-text-sm tw-hw-font-semibold">
        {executePreDepositCheckError ? (
          <span className="tw-hw-text-red-400">
            {executePreDepositCheckError.toString()}
          </span>
        ) : (
          <span className="tw-hw-text-hyphen-gray-400">
            Checking available liquidity...
          </span>
        )}
      </span>
      <article className="tw-hw-flex tw-hw-items-center tw-hw-justify-center tw-hw-rounded-[10px] tw-hw-bg-hyphen-warning tw-hw-bg-opacity-25 tw-hw-py-2 tw-hw-px-4 tw-hw-text-hyphen-warning">
        <HiExclamation className="tw-hw-mr-2 tw-hw-h-3 tw-hw-w-3" />
        <p className="tw-hw-text-xxs tw-hw-font-bold tw-hw-uppercase">
          Please do not refresh or change network.
        </p>
      </article>
    </>
  );
};

const DepositStep: React.FC<
  Step & {
    depositState: Status;
    setDepositState: (state: Status) => void;
    setModalErrored: (modalErrored: boolean) => void;
  }
> = ({
  currentStepNumber,
  depositState,
  stepNumber,
  setDepositState,
  onNextStep,
  setModalErrored,
  transferModalData,
}) => {
  const active = currentStepNumber === stepNumber;
  const {
    executeDeposit,
    executeDepositStatus,
    executeDepositValue,
    executeDepositError,
  } = useTransaction()!;
  const { fromChain, selectedToken, toChain } = transferModalData;
  const {
    receiver: { receiverAddress },
    transferAmountInputValue,
    transactionFee,
  } = useTransaction()!;

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
            {transferAmountInputValue} {selectedToken?.symbol}
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

      <span className="tw-hw-mb-3 tw-hw-block tw-hw-w-full tw-hw-rounded-[10px] tw-hw-bg-hyphen-gray-300 tw-hw-bg-opacity-25 tw-hw-py-4 tw-hw-text-sm tw-hw-font-semibold">
        {executeDepositError ? (
          <span className="tw-hw-text-red-400">
            {executeDepositError?.message || executeDepositError.toString()}
          </span>
        ) : null}

        {executeDepositStatus === Status.PENDING ? (
          <span className="tw-hw-text-hyphen-gray-400">
            Approve transaction...
          </span>
        ) : executeDepositStatus === Status.SUCCESS ? (
          <span className="tw-hw-text-hyphen-gray-400">
            Bridging in progress...
          </span>
        ) : null}
      </span>
      <article className="tw-hw-flex tw-hw-items-center tw-hw-justify-center tw-hw-rounded-[10px] tw-hw-bg-hyphen-warning tw-hw-bg-opacity-25 tw-hw-py-2 tw-hw-px-4 tw-hw-text-hyphen-warning">
        <HiExclamation className="tw-hw-mr-2 tw-hw-h-3 tw-hw-w-3" />
        <p className="tw-hw-text-xxs tw-hw-font-bold tw-hw-uppercase">
          Please do not refresh or change network.
        </p>
      </article>
    </>
  );
};

const ReceivalStep: React.FC<
  Step & {
    // hideManualExit: () => void;
    setModalErrored: (modalErrored: boolean) => void;
    refreshSelectedTokenBalance: () => void;
    setReceivalState: (state: Status) => void;
    // showManualExit: () => void;
    receivalState: Status;
    startTime: Date | undefined;
    endTime: Date | undefined;
  }
> = ({
  currentStepNumber,
  // hideManualExit,
  setModalErrored,
  onNextStep,
  refreshSelectedTokenBalance,
  setReceivalState,
  // showManualExit,
  stepNumber,
  transferModalData,
  receivalState,
  startTime,
  endTime,
}) => {
  const active = currentStepNumber >= stepNumber;

  const {
    checkReceival,
    exitHash,
    setExitHash,
    gasTokenSwapData,
    transferAmountInputValue,
    executeDepositValue,
    transactionFee,
    fetchTransactionFeeStatus,
  } = useTransaction()!;

  const {
    fromChain,
    selectedToken,
    toChainRpcUrlProvider,
    toChain,
    // transactionFee,
  } = transferModalData;

  const [receivalError, setReceivalError] = useState<any>();
  const [executed, setExecuted] = useState(false);
  const transferTime =
    startTime && endTime ? formatDistanceStrict(endTime, startTime) : undefined;

  useEffect(() => {
    if (active) {
      let tries = 0;
      let keepChecking = setInterval(async () => {
        try {
          tries++;
          let hash = await checkReceival();
          if (hash) {
            clearInterval(keepChecking);
            // hideManualExit();
            refreshSelectedTokenBalance();
            setExitHash(hash);
            setExecuted(true);
          }
          // else if (tries > MANUAL_EXIT_RETRIES) {
          //   showManualExit();
          // }
          else if (tries > 300) {
            clearInterval(keepChecking);
            throw new Error('exhauseted max retries');
          }
        } catch (e) {
          setReceivalError(e);
          setModalErrored(true);
        }
      }, 5000);
    }
    // Note: Remember to update the dependency array if adding manual exit.
  }, [
    active,
    checkReceival,
    refreshSelectedTokenBalance,
    setExitHash,
    setModalErrored,
  ]);

  useEffect(() => {
    try {
      if (!toChainRpcUrlProvider) {
        console.error(
          'We were not able to fetch the details, please refresh and try again later.'
        );
        setReceivalError(
          'We were not able to fetch the details, please refresh and try again later.'
        );
        throw new Error(
          'We were not able to fetch the details, please refresh and try again later.'
        );
      } else if (exitHash && executed && active) {
        setReceivalState(Status.PENDING);
        (async () => {
          let tx = await toChainRpcUrlProvider.getTransaction(exitHash);
          setExecuted(false);
          await tx?.wait(1);
          setReceivalState(Status.SUCCESS);
          onNextStep();
        })();
      }
    } catch (e) {
      setReceivalError(e);
      setModalErrored(true);
    }
  }, [
    active,
    executed,
    exitHash,
    onNextStep,
    setModalErrored,
    setReceivalState,
    toChainRpcUrlProvider,
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
            {transferAmountInputValue} {selectedToken?.symbol}
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
          {receivalState === Status.SUCCESS ? (
            <img
              src={bridgingCompleteArrow}
              alt="Bridging complete confirmation"
              className="tw-hw-mx-auto tw-hw-h-10 tw-hw-w-10 md:tw-hw-h-14 md:tw-hw-w-14"
            />
          ) : (
            <img
              src={loadingSpinner}
              alt="Loading..."
              className="tw-hw-mx-auto tw-hw-h-10 tw-hw-w-10 tw-hw-animate-spin md:tw-hw-h-14 md:tw-hw-w-14"
            />
          )}
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
        {receivalState === Status.PENDING ||
        receivalState === Status.SUCCESS ? (
          <button
            onClick={() => {
              window.open(`${toChain?.explorerUrl}/tx/${exitHash}`, '_blank');
            }}
            className="tw-hw-flex tw-hw-w-auto tw-hw-items-center tw-hw-rounded-full tw-hw-bg-hyphen-purple tw-hw-px-[10px] tw-hw-py-1 tw-hw-text-xxs tw-hw-font-bold tw-hw-uppercase tw-hw-text-white"
          >
            Exit Tx
            <FiArrowUpRight className="tw-hw-h-3 tw-hw-w-3" />
          </button>
        ) : (
          <button
            disabled
            className="tw-hw-flex tw-hw-w-auto tw-hw-items-center tw-hw-rounded-full tw-hw-bg-hyphen-gray-300 tw-hw-px-[10px] tw-hw-py-1 tw-hw-text-xxs tw-hw-font-bold tw-hw-uppercase tw-hw-text-white"
          >
            Exit Tx
            <FiArrowUpRight className="tw-hw-h-3 tw-hw-w-3" />
          </button>
        )}
      </div>

      {receivalState === Status.SUCCESS ? (
        <span className="tw-hw-mb-3 tw-hw-block tw-hw-w-full tw-hw-rounded-[10px] tw-hw-bg-hyphen-success tw-hw-bg-opacity-25 tw-hw-py-4 tw-hw-text-sm tw-hw-font-semibold">
          {receivalError ? (
            <span className="tw-hw-text-red-400">
              {receivalError?.message || receivalError.toString()}
            </span>
          ) : (
            <span className="tw-hw-text-hyphen-success-100">
              Bridging completed! 😎
            </span>
          )}
        </span>
      ) : (
        <span className="tw-hw-mb-3 tw-hw-block tw-hw-w-full tw-hw-rounded-[10px] tw-hw-bg-hyphen-gray-300 tw-hw-bg-opacity-25 tw-hw-py-4 tw-hw-text-sm tw-hw-font-semibold tw-hw-text-hyphen-gray-400">
          Bridging in progress...
        </span>
      )}

      {receivalState === Status.SUCCESS ? (
        <div className="tw-hw-mt-1 tw-hw-flex tw-hw-items-center tw-hw-justify-center tw-hw-py-2 tw-hw-px-4">
          <span className="tw-hw-text-xxs tw-hw-font-bold tw-hw-uppercase tw-hw-text-hyphen-gray-400">
            {fromChain?.name}
          </span>
          <HiOutlineArrowSmRight className="tw-hw-mx-1 tw-hw-h-3 tw-hw-w-3 tw-hw-text-hyphen-purple" />
          <span className="tw-hw-text-xxs tw-hw-font-bold tw-hw-uppercase tw-hw-text-hyphen-gray-400">
            {toChain?.name}
          </span>
          <span className="tw-hw-mx-1 tw-hw-text-xxs tw-hw-font-bold tw-hw-uppercase tw-hw-text-hyphen-gray-400">
            ⚡ in {transferTime}
          </span>
          <div
            className="tw-hw-flex tw-hw-items-center"
            data-tip
            data-for="totalFees"
          >
            <HiInformationCircle className="tw-hw-mr-1 tw-hw-h-2.5 tw-hw-w-2.5 tw-hw-text-hyphen-gray-400" />
            <span className="tw-hw-text-xxs tw-hw-font-bold tw-hw-uppercase tw-hw-text-hyphen-gray-400">
              Total fees
            </span>
          </div>
          {transactionFee ? (
            <CustomTooltip id="totalFees">
              <div>
                <span>LP fee ({transactionFee.transferFeePercentage}%): </span>
                {fetchTransactionFeeStatus === Status.SUCCESS &&
                transactionFee ? (
                  <>{`${transactionFee.lpFeeProcessedString} ${selectedToken?.symbol}`}</>
                ) : (
                  '...'
                )}
              </div>
              {transactionFee && transactionFee.rewardAmountString ? (
                <div>
                  <span>Reward amount: </span>
                  {fetchTransactionFeeStatus === Status.SUCCESS &&
                  transactionFee ? (
                    <>{`${transactionFee.rewardAmountString} ${selectedToken?.symbol}`}</>
                  ) : (
                    '...'
                  )}
                </div>
              ) : null}
              <div>
                <span>Transaction fee: </span>
                {fetchTransactionFeeStatus === Status.SUCCESS &&
                transactionFee ? (
                  <>{`${transactionFee.transactionFeeProcessedString} ${selectedToken?.symbol}`}</>
                ) : (
                  '...'
                )}
              </div>
              {gasTokenSwapData ? (
                <div>
                  <span>Gas token worth: </span>
                  <>{`${gasTokenSwapData?.gasTokenAmountInDepositCurrency.toFixed(
                    5
                  )} ${selectedToken?.symbol}`}</>
                </div>
              ) : null}
            </CustomTooltip>
          ) : null}
        </div>
      ) : (
        <article className="tw-hw-flex tw-hw-items-center tw-hw-justify-center tw-hw-rounded-[10px] tw-hw-bg-hyphen-warning tw-hw-bg-opacity-25 tw-hw-py-2 tw-hw-px-4 tw-hw-text-hyphen-warning">
          <HiExclamation className="tw-hw-mr-2 tw-hw-h-3 tw-hw-w-3" />
          <p className="tw-hw-text-xxs tw-hw-font-bold tw-hw-uppercase">
            Please do not refresh or change network.
          </p>
        </article>
      )}
    </>
  );
};

export const TransferModal: React.FC<ITransferModalProps> = ({
  isVisible,
  onClose,
  transferModalData,
}) => {
  const { refreshSelectedTokenBalance } = useToken()!;
  const [modalErrored, setModalErrored] = useState(false);

  useEffect(() => {
    console.log({ modalErrored });
  }, [modalErrored]);

  const [depositState, setDepositState] = useState<Status>(Status.IDLE);
  const [receivalState, setReceivalState] = useState<Status>(Status.IDLE);
  const [startTime, setStartTime] = useState<Date>();
  const [endTime, setEndTime] = useState<Date>();
  const [activeStep, setActiveStep] = useState(0);
  // const [canManualExit, setCanManualExit] = useState(false);
  // const [isManualExitDisabled, setIsManualExitDisabled] = useState(false);
  const nextStep = useCallback(
    () => setActiveStep((i) => i + 1),
    [setActiveStep]
  );

  useEffect(() => {
    if (activeStep === 3) {
      setStartTime(new Date());
    } else if (activeStep === 4) {
      setEndTime(new Date());
    }
  }, [activeStep]);

  useEffect(() => {
    if (isVisible) setActiveStep(1);
    else {
      setActiveStep(0);
      setDepositState(Status.IDLE);
      setReceivalState(Status.IDLE);
      setModalErrored(false);
      setStartTime(undefined);
      setEndTime(undefined);
    }
  }, [isVisible]);

  const isExitAllowed = useMemo(() => {
    if (activeStep === 2 || activeStep === 3) {
      if (modalErrored) {
        return true;
      }
    } else {
      return true;
    }
    return false;
  }, [activeStep, modalErrored]);

  // const showManualExit = useCallback(() => {
  //   setCanManualExit(true);
  // }, []);

  // const hideManualExit = useCallback(() => {
  //   setCanManualExit(false);
  // }, []);

  // const disableManualExit = () => {
  //   setIsManualExitDisabled(true);
  // };

  // async function triggerManualExit() {
  //   try {
  //     console.log(
  //       `Triggering manual exit for deposit hash ${executeDepositValue.hash} and chainId ${fromChain?.chainId}...`
  //     );
  //     disableManualExit();
  //     const response = await hyphen.triggerManualTransfer(
  //       executeDepositValue.hash,
  //       fromChain?.chainId
  //     );
  //     if (response && response.exitHash) {
  //       hideManualExit();
  //       setReceivalState(Status.PENDING);
  //     }
  //   } catch (e) {
  //     console.error("Failed to execute manual transfer: ", e);
  //   }
  // }

  return (
    <Transition appear show={isVisible} as={Fragment}>
      <Dialog as="div" className="tw-hw-relative tw-hw-z-10" onClose={() => {}}>
        <Transition.Child
          as={Fragment}
          enter="tw-hw-ease-out tw-hw-duration-300"
          enterFrom="tw-hw-opacity-0"
          enterTo="tw-hw-opacity-100"
          leave="tw-hw-ease-in tw-hw-duration-200"
          leaveFrom="tw-hw-opacity-100"
          leaveTo="tw-hw-opacity-0"
        >
          <div className="tw-hw-fixed tw-hw-inset-0 tw-hw-bg-black tw-hw-bg-opacity-25" />
        </Transition.Child>

        <div className="tw-hw-fixed tw-hw-inset-0 tw-hw-overflow-y-auto">
          <div className="tw-hw-flex tw-hw-min-h-full tw-hw-items-center tw-hw-justify-center tw-hw-p-4 tw-hw-text-center">
            <Transition.Child
              as={Fragment}
              enter="tw-hw-ease-out tw-hw-duration-300"
              enterFrom="tw-hw-opacity-0 tw-hw-scale-95"
              enterTo="tw-hw-opacity-100 tw-hw-scale-100"
              leave="tw-hw-ease-in tw-hw-duration-200"
              leaveFrom="tw-hw-opacity-100 tw-hw-scale-100"
              leaveTo="tw-hw-opacity-0 tw-hw-scale-95"
            >
              <div className="tw-hw-flex tw-hw-h-auto tw-hw-w-[330px] tw-hw-flex-col tw-hw-rounded-[25px] tw-hw-bg-white tw-hw-p-7.5 md:tw-hw-w-[464px] md:tw-hw-p-12.5">
                <div className="tw-hw-mb-10 tw-hw-flex tw-hw-items-center tw-hw-justify-between">
                  <Dialog.Title
                    as="h3"
                    className="tw-hw-text-left tw-hw-text-base tw-hw-font-semibold tw-hw-text-hyphen-purple"
                  >
                    Transfer Activity
                  </Dialog.Title>
                  <span data-tip data-for="whyModalExitDisabled">
                    <button
                      className="tw-hw-rounded hover:tw-hw-bg-gray-100"
                      onClick={() => {
                        isExitAllowed && onClose();
                      }}
                      disabled={!isExitAllowed}
                    >
                      <IoMdClose className="tw-hw-h-6 tw-hw-w-auto tw-hw-text-gray-500" />
                    </button>
                  </span>
                  {!isExitAllowed && (
                    <CustomTooltip id="whyModalExitDisabled">
                      <span>
                        Exit is disabled because transfer is in progress
                      </span>
                    </CustomTooltip>
                  )}
                </div>

                {activeStep === 1 ? (
                  <PreDepositStep
                    currentStepNumber={activeStep}
                    stepNumber={1}
                    onNextStep={nextStep}
                    setModalErrored={setModalErrored}
                    transferModalData={transferModalData}
                  />
                ) : null}
                {activeStep === 2 ? (
                  <DepositStep
                    currentStepNumber={activeStep}
                    depositState={depositState}
                    stepNumber={2}
                    onNextStep={nextStep}
                    setModalErrored={setModalErrored}
                    setDepositState={setDepositState}
                    transferModalData={transferModalData}
                  />
                ) : null}
                {activeStep >= 3 ? (
                  <ReceivalStep
                    currentStepNumber={activeStep}
                    // hideManualExit={hideManualExit}
                    setModalErrored={setModalErrored}
                    onNextStep={nextStep}
                    refreshSelectedTokenBalance={refreshSelectedTokenBalance}
                    setReceivalState={setReceivalState}
                    // showManualExit={showManualExit}
                    stepNumber={3}
                    transferModalData={transferModalData}
                    receivalState={receivalState}
                    startTime={startTime}
                    endTime={endTime}
                  />
                ) : null}
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default TransferModal;
