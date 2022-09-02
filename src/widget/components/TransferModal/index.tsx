import PrimaryButton from 'components/Buttons/PrimaryButton';
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
import {
  ITransferRecord,
  useTransactionInfoModal,
} from 'context/TransactionInfoModal';
import { Status } from 'hooks/useLoading';
import AnimateHeight from 'react-animate-height';
import {
  HiExclamation,
  HiInformationCircle,
  HiOutlineArrowSmRight,
} from 'react-icons/hi';
// import { MANUAL_EXIT_RETRIES } from "../../../../config/constants";
import arrowRight from 'assets/images/arrow-right.svg';
import bridgingCompleteArrow from 'assets/images/bridging-complete-arrow.svg';
import loadingSpinner from 'assets/images/loading-spinner.svg';
import { FiArrowUpRight } from 'react-icons/fi';

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
  const completed = currentStepNumber > stepNumber;

  // we set this to true after this step is executed
  // this is done so that stale values of value and error are not used
  const [executed, setExecuted] = useState(false);
  const { toChain } = transferModalData;

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
    <AnimateHeight height={active ? 'auto' : 0}>
      <img
        src={loadingSpinner}
        alt="Loading..."
        className="mx-auto mb-[50px] animate-spin"
      />
      <PrimaryButton className="mb-3 w-full bg-hyphen-gray-300 bg-opacity-25 text-base font-semibold text-hyphen-gray-400">
        Checking available liquidity...
      </PrimaryButton>
      <article className="flex items-center justify-center rounded-[10px] bg-hyphen-warning bg-opacity-25 p-2 text-hyphen-warning">
        <HiExclamation className="mr-2 h-3 w-3" />
        <p className="text-xxs font-bold uppercase">
          Please do not refresh or change network.
        </p>
      </article>
    </AnimateHeight>
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
  const completed = currentStepNumber > stepNumber;
  const {
    executeDeposit,
    executeDepositStatus,
    executeDepositValue,
    executeDepositError,
  } = useTransaction()!;
  const { fromChain, selectedToken, transferAmount, toChain } =
    transferModalData;
  const {
    receiver: { receiverAddress },
    transferAmountInputValue,
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
    <AnimateHeight height={active ? 'auto' : 0}>
      <article className="mb-[50px] grid grid-cols-3">
        <div className="flex flex-col items-start">
          <div className="relative mb-3">
            <img
              className="h-10 w-10"
              src={fromChain?.image}
              alt={`Destination chain ${fromChain?.name}`}
            />
            <img
              className="absolute top-[10px] right-[-10px] h-5 w-5"
              src={selectedToken?.image}
              alt={`Selected token ${selectedToken?.symbol}`}
            />
          </div>
          <span className="text-sm font-semibold text-hyphen-gray-400">
            {transferAmountInputValue} {selectedToken?.symbol}
          </span>
          <span className="mb-5 text-sm font-semibold text-hyphen-gray-400">
            On {fromChain?.name}
          </span>

          {depositState === Status.PENDING ||
          depositState === Status.SUCCESS ? (
            <button
              onClick={() => {
                window.open(
                  `${fromChain?.explorerUrl}/tx/${executeDepositValue.hash}`,
                  '_blank'
                );
              }}
              className="flex items-center rounded-full bg-hyphen-purple px-[10px] py-1 text-xxs font-bold uppercase text-white"
            >
              Source Tx
              <FiArrowUpRight className="h-3 w-3" />
            </button>
          ) : (
            <button
              disabled
              className="flex items-center rounded-full bg-hyphen-gray-300 px-[10px] py-1 text-xxs font-bold uppercase text-white"
            >
              Source Tx
              <FiArrowUpRight className="h-3 w-3" />
            </button>
          )}
        </div>

        <div className="flex flex-col items-center justify-center">
          <img src={arrowRight} alt="Deposit direction" className="mb-8" />
          <img
            src={loadingSpinner}
            alt="Loading..."
            className="mx-auto h-[60px] animate-spin"
          />
        </div>

        <div className="flex flex-col items-end">
          <div className="relative mb-3">
            <img
              className="h-10 w-10"
              src={fromChain?.image}
              alt={`Destination chain ${fromChain?.name}`}
            />
            <img
              className="absolute top-[10px] left-[-10px] h-5 w-5"
              src={selectedToken?.image}
              alt={`Selected token ${selectedToken?.symbol}`}
            />
          </div>
          <span className="text-sm font-semibold text-hyphen-gray-400">
            {transferAmountInputValue} {selectedToken?.symbol}
          </span>
          <span className="mb-5 text-sm font-semibold text-hyphen-gray-400">
            On {toChain?.name}
          </span>
          <button
            disabled
            className="flex items-center rounded-full bg-hyphen-gray-300 px-[10px] py-1 text-xxs font-bold uppercase text-white"
          >
            Destination Tx
            <FiArrowUpRight className="h-3 w-3" />
          </button>
        </div>
      </article>
      <PrimaryButton className="mb-3 w-full bg-hyphen-gray-300 bg-opacity-25 text-base font-semibold text-hyphen-gray-400">
        {executeDepositStatus === Status.PENDING
          ? 'Check your wallet...'
          : executeDepositStatus === Status.SUCCESS
          ? 'Bridging in progress...'
          : 'We encountered a glitch!'}
      </PrimaryButton>
      <article className="flex items-center justify-center rounded-[10px] bg-hyphen-warning bg-opacity-25 p-2 text-hyphen-warning">
        <HiExclamation className="mr-2 h-3 w-3" />
        <p className="text-xxs font-bold uppercase">
          Please do not refresh or change network.
        </p>
      </article>
    </AnimateHeight>
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
}) => {
  const active = currentStepNumber === stepNumber;
  const completed = currentStepNumber > stepNumber;

  const {
    checkReceival,
    exitHash,
    setExitHash,
    gasTokenSwapData,
    transferAmountInputValue,
    executeDepositValue,
  } = useTransaction()!;
  const {
    fromChain,
    selectedToken,
    toChainRpcUrlProvider,
    toChain,
    transactionFee,
  } = transferModalData;

  const [receivalError, setReceivalError] = useState<any>();
  const [executed, setExecuted] = useState(false);

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
          // onNextStep();
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
    setModalErrored,
    setReceivalState,
    toChainRpcUrlProvider,
  ]);

  return (
    <AnimateHeight height={active ? 'auto' : 0}>
      <article className="mb-[50px] grid grid-cols-3">
        <div className="flex flex-col items-start">
          <div className="relative mb-3">
            <img
              className="h-10 w-10"
              src={fromChain?.image}
              alt={`Destination chain ${fromChain?.name}`}
            />
            <img
              className="absolute top-[10px] right-[-10px] h-5 w-5"
              src={selectedToken?.image}
              alt={`Selected token ${selectedToken?.symbol}`}
            />
          </div>
          <span className="text-sm font-semibold text-hyphen-gray-400">
            {transferAmountInputValue} {selectedToken?.symbol}
          </span>
          <span className="mb-5 text-sm font-semibold text-hyphen-gray-400">
            On {fromChain?.name}
          </span>
          <button
            onClick={() => {
              window.open(
                `${fromChain?.explorerUrl}/tx/${executeDepositValue.hash}`,
                '_blank'
              );
            }}
            className="flex items-center rounded-full bg-hyphen-purple px-[10px] py-1 text-xxs font-bold uppercase text-white"
          >
            Source Tx
            <FiArrowUpRight className="h-3 w-3" />
          </button>
        </div>

        <div className="flex flex-col items-center justify-center">
          <img src={arrowRight} alt="Deposit direction" className="mb-8" />
          {receivalState === Status.SUCCESS ? (
            <img
              src={bridgingCompleteArrow}
              alt="Bridging complete confirmation"
              className="mx-auto h-[60px]"
            />
          ) : (
            <img
              src={loadingSpinner}
              alt="Loading..."
              className="mx-auto h-[60px] animate-spin"
            />
          )}
        </div>

        <div className="flex flex-col items-end">
          <div className="relative mb-3">
            <img
              className="h-10 w-10"
              src={toChain?.image}
              alt={`Destination chain ${toChain?.name}`}
            />
            <img
              className="absolute top-[10px] left-[-10px] h-5 w-5"
              src={selectedToken?.image}
              alt={`Selected token ${selectedToken?.symbol}`}
            />
          </div>
          <span className="text-sm font-semibold text-hyphen-gray-400">
            {transferAmountInputValue} {selectedToken?.symbol}
          </span>
          <span className="mb-5 text-sm font-semibold text-hyphen-gray-400">
            On {toChain?.name}
          </span>
          {receivalState === Status.PENDING ||
          receivalState === Status.SUCCESS ? (
            <button
              onClick={() => {
                window.open(`${toChain?.explorerUrl}/tx/${exitHash}`, '_blank');
              }}
              className="flex items-center rounded-full bg-hyphen-purple px-[10px] py-1 text-xxs font-bold uppercase text-white"
            >
              Destination Tx
              <FiArrowUpRight className="h-3 w-3" />
            </button>
          ) : (
            <button
              disabled
              className="flex items-center rounded-full bg-hyphen-gray-300 px-[10px] py-1 text-xxs font-bold uppercase text-white"
            >
              Destination Tx
              <FiArrowUpRight className="h-3 w-3" />
            </button>
          )}
        </div>
      </article>

      {receivalState === Status.SUCCESS ? (
        <PrimaryButton className="mb-3 w-full bg-hyphen-success bg-opacity-25 text-base font-semibold text-hyphen-gray-400">
          Bridging completed! 😎
        </PrimaryButton>
      ) : (
        <PrimaryButton className="mb-3 w-full bg-hyphen-gray-300 bg-opacity-25 text-base font-semibold text-hyphen-gray-400">
          {receivalState === Status.PENDING
            ? 'Checking for receival...'
            : 'Bridging in progress...'}
        </PrimaryButton>
      )}

      {receivalState === Status.SUCCESS ? (
        <div className="mt-1 flex items-center justify-center">
          <span className="text-xxs font-bold uppercase text-hyphen-gray-400">
            {fromChain?.name}
          </span>
          <HiOutlineArrowSmRight className="mx-1 h-3 w-3 text-hyphen-purple" />
          <span className="text-xxs font-bold uppercase text-hyphen-gray-400">
            {toChain?.name}
          </span>
          <span className="mx-1 text-xxs">⚡</span>
          <div className="flex items-center" data-tip data-for="totalFees">
            <HiInformationCircle className="mr-1 h-2.5 w-2.5 text-hyphen-gray-300" />
            <span className="text-xxs font-bold uppercase text-hyphen-gray-300">
              Total fees
            </span>
          </div>
        </div>
      ) : (
        <article className="flex items-center justify-center rounded-[10px] bg-hyphen-warning bg-opacity-25 p-2 text-hyphen-warning">
          <HiExclamation className="mr-2 h-3 w-3" />
          <p className="text-xxs font-bold uppercase">
            Please do not refresh or change network.
          </p>
        </article>
      )}
    </AnimateHeight>
  );
};

export const TransferModal: React.FC<ITransferModalProps> = ({
  isVisible,
  onClose,
  transferModalData,
}) => {
  const { fromChain, selectedToken, toChain, transferAmount, transactionFee } =
    transferModalData;

  const { refreshSelectedTokenBalance } = useToken()!;
  const { executeDepositValue, exitHash } = useTransaction()!;
  // const { hyphen } = useHyphen()!;
  const { showTransactionInfoModal } = useTransactionInfoModal()!;
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

  const isBottomTrayOpen = useMemo(() => {
    return (
      depositState === Status.PENDING ||
      depositState === Status.SUCCESS ||
      receivalState === Status.PENDING ||
      receivalState === Status.SUCCESS
    );
  }, [depositState, receivalState]);

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

  const openTransferInfoModal = useCallback(() => {
    if (
      !transferAmount ||
      !exitHash ||
      !fromChain ||
      !toChain ||
      !selectedToken ||
      !transactionFee ||
      !endTime ||
      !startTime
    ) {
      return;
    }

    let transferRecord: ITransferRecord = {
      depositHash: executeDepositValue.hash,
      depositAmount: transferAmount.toString(),
      exitHash: exitHash,
      token: selectedToken,
      fromChain,
      toChain,
      lpFee: transactionFee.lpFeeProcessedString,
      rewardAmount: transactionFee.rewardAmountString,
      transferredAmount: transactionFee.amountToGetProcessedString,
      transactionFee: transactionFee.transactionFeeProcessedString,
      transferTime: formatDistanceStrict(endTime, startTime),
    };

    showTransactionInfoModal(transferRecord);
  }, [
    executeDepositValue?.hash,
    exitHash,
    fromChain,
    selectedToken,
    toChain,
    transactionFee,
    transferAmount,
    showTransactionInfoModal,
    startTime,
    endTime,
  ]);

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
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="flex h-[446px] w-[464px] flex-col rounded-[25px] bg-white p-12.5">
                <Dialog.Title
                  as="h3"
                  className="mb-10 text-left text-base font-semibold text-hyphen-purple"
                >
                  Transfer Activity
                </Dialog.Title>

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
                {activeStep === 3 ? (
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
                  />
                ) : null}
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );

  // return (
  //   <Modal isVisible={isVisible} onClose={() => {}}>
  //     <div className="mb-14">
  //       <div className="relative z-20 rounded-3xl border border-hyphen-purple-darker/50 bg-white p-6 shadow-lg">
  //         <div className="absolute -inset-2 -z-10 rounded-3xl bg-white/60 opacity-50 blur-lg"></div>
  //         <div className="flex flex-col">
  //           <div className="mb-4 flex items-center justify-between">
  //             <Dialog.Title
  //               as="h1"
  //               className="text-xl font-semibold text-gray-700"
  //             >
  //               Transfer Activity
  //             </Dialog.Title>
  //             <span data-tip data-for="whyModalExitDisabled">
  //               <button
  //                 className="rounded hover:bg-gray-100"
  //                 onClick={() => {
  //                   isExitAllowed && onClose();
  //                 }}
  //                 disabled={!isExitAllowed}
  //               >
  //                 <IoMdClose className="h-6 w-auto text-gray-500" />
  //               </button>
  //             </span>
  //             {!isExitAllowed && (
  //               <CustomTooltip id="whyModalExitDisabled">
  //                 <span>Exit is disabled because transfer is in progress</span>
  //               </CustomTooltip>
  //             )}
  //           </div>
  //           <div className="flex flex-col gap-2 pl-2">
  //             <PreDepositStep
  //               currentStepNumber={activeStep}
  //               stepNumber={1}
  //               onNextStep={nextStep}
  //               setModalErrored={setModalErrored}
  //               transferModalData={transferModalData}
  //             />
  //             <DepositStep
  //               currentStepNumber={activeStep}
  //               stepNumber={2}
  //               onNextStep={nextStep}
  //               setModalErrored={setModalErrored}
  //               setDepositState={setDepositState}
  //               transferModalData={transferModalData}
  //             />
  //             <ReceivalStep
  //               currentStepNumber={activeStep}
  //               // hideManualExit={hideManualExit}
  //               setModalErrored={setModalErrored}
  //               onNextStep={nextStep}
  //               refreshSelectedTokenBalance={refreshSelectedTokenBalance}
  //               setReceivalState={setReceivalState}
  //               // showManualExit={showManualExit}
  //               stepNumber={3}
  //               transferModalData={transferModalData}
  //             />
  //           </div>
  //           <div className="mt-4 flex justify-center pt-3 pb-2">
  //             {modalErrored ? (
  //               <PrimaryButton
  //                 className="px-8"
  //                 onClick={() => {
  //                   onClose();
  //                 }}
  //               >
  //                 <span>Close</span>
  //               </PrimaryButton>
  //             ) : (
  //               <PrimaryButton
  //                 className="px-8"
  //                 disabled={receivalState !== Status.SUCCESS}
  //                 onClick={() => {
  //                   openTransferInfoModal();
  //                 }}
  //               >
  //                 <div className="flex items-center gap-3">
  //                   {receivalState !== Status.SUCCESS ? (
  //                     <>
  //                       {/* <Spinner /> */}
  //                       <span>Transfer in Progress </span>
  //                     </>
  //                   ) : (
  //                     <>
  //                       <span>View Details</span>
  //                     </>
  //                   )}
  //                 </div>
  //               </PrimaryButton>
  //             )}
  //           </div>
  //         </div>
  //       </div>

  //       <TransitionReact in={isBottomTrayOpen} timeout={300}>
  //         {(state) => (
  //           <div
  //             className={twMerge(
  //               'transform-gpu transition-transform',
  //               (state === 'exiting' || state === 'exited') &&
  //                 '-translate-y-full'
  //             )}
  //           >
  //             <div className="relative mx-10">
  //               <div className="absolute -inset-[2px] -z-10 bg-gradient-to-br from-white/10 to-hyphen-purple/30 opacity-80 blur-md"></div>
  //               <div className="relative z-0 rounded-b-md border-x border-b border-white/20 bg-gradient-to-r from-hyphen-purple-darker via-hyphen-purple-mid to-hyphen-purple-darker p-4 shadow-lg backdrop-blur">
  //                 <article className="mb-4 flex items-start rounded-xl bg-red-100 p-2 text-sm text-red-600">
  //                   <HiExclamation className="mr-2 h-6 w-auto" />
  //                   <p>
  //                     Please do not refresh or change network while the
  //                     transaction is in progress.
  //                   </p>
  //                 </article>
  //                 <div
  //                   className="grid gap-y-2 text-white/75"
  //                   style={{ gridTemplateColumns: '1fr auto' }}
  //                 >
  //                   <span className="flex items-center gap-3 font-normal">
  //                     Deposit on {fromChain?.name}
  //                   </span>
  //                   <span className="text-right">
  //                     {depositState === Status.PENDING ||
  //                     depositState === Status.SUCCESS ? (
  //                       <PrimaryButtonDark
  //                         className="px-6"
  //                         onClick={() => {
  //                           window.open(
  //                             `${fromChain?.explorerUrl}/tx/${executeDepositValue.hash}`,
  //                             '_blank'
  //                           );
  //                         }}
  //                       >
  //                         {depositState === Status.PENDING && (
  //                           <div className="flex items-center gap-3">
  //                             <SpinnerDark />
  //                             <span className="flex items-center gap-2">
  //                               <span>Pending</span>
  //                               <span>
  //                                 <HiOutlineArrowSmRight className="h-5 w-5 -rotate-45" />
  //                               </span>
  //                             </span>
  //                           </div>
  //                         )}
  //                         {depositState === Status.SUCCESS && (
  //                           <div className="flex items-center gap-2">
  //                             <span>Confirmed</span>
  //                             <span>
  //                               <HiOutlineArrowSmRight className="h-5 w-5 -rotate-45" />
  //                             </span>
  //                           </div>
  //                         )}
  //                       </PrimaryButtonDark>
  //                     ) : (
  //                       <Skeleton
  //                         baseColor="#ffffff10"
  //                         highlightColor="#ffffff15"
  //                         className="my-4 mr-2 max-w-[100px]"
  //                       />
  //                     )}
  //                   </span>
  //                   <span className="flex items-center gap-3 font-normal">
  //                     Transfer on {toChain?.name}
  //                     {/* {canManualExit
  //                       ? "Transfer taking time?"
  //                       : `Transfer on ${toChain?.name}`} */}
  //                   </span>
  //                   <span className="text-right">
  //                     {
  //                       // canManualExit ? (
  //                       //   <PrimaryButtonDark
  //                       //     className="px-6"
  //                       //     onClick={triggerManualExit}
  //                       //     disabled={isManualExitDisabled}
  //                       //   >
  //                       //     Click here
  //                       //   </PrimaryButtonDark>
  //                       // ) :
  //                       receivalState === Status.PENDING ||
  //                       receivalState === Status.SUCCESS ? (
  //                         <PrimaryButtonDark
  //                           className="px-6"
  //                           onClick={() => {
  //                             window.open(
  //                               `${toChain?.explorerUrl}/tx/${exitHash}`,
  //                               '_blank'
  //                             );
  //                           }}
  //                         >
  //                           {receivalState === Status.PENDING && (
  //                             <div className="flex items-center gap-3">
  //                               <SpinnerDark />
  //                               <span className="flex items-center gap-2">
  //                                 <span>Pending</span>
  //                                 <span>
  //                                   <HiOutlineArrowSmRight className="h-5 w-5 -rotate-45" />
  //                                 </span>
  //                               </span>
  //                             </div>
  //                           )}
  //                           {receivalState === Status.SUCCESS && (
  //                             <div className="flex items-center gap-2">
  //                               <span>Confirmed</span>
  //                               <span>
  //                                 <HiOutlineArrowSmRight className="h-5 w-5 -rotate-45" />
  //                               </span>
  //                             </div>
  //                           )}
  //                         </PrimaryButtonDark>
  //                       ) : (
  //                         <Skeleton
  //                           baseColor="#ffffff10"
  //                           highlightColor="#ffffff15"
  //                           className="my-4 mr-2 max-w-[100px]"
  //                         />
  //                       )
  //                     }
  //                   </span>
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         )}
  //       </TransitionReact>
  //     </div>
  //   </Modal>
  // );
};

export default TransferModal;
