import arrowRight from 'assets/images/arrow-right.svg';
import bridgingCompleteArrow from 'assets/images/bridging-complete-arrow.svg';
import loadingSpinner from 'assets/images/loading-spinner.svg';
import CustomTooltip from 'components/CustomTooltip';
import { useTransaction } from 'context/Transaction';
import { useWalletProvider } from 'context/WalletProvider';
import { formatDistanceStrict } from 'date-fns';
import { Status } from 'hooks/useLoading';
import { useEffect, useState } from 'react';
import { FiArrowUpRight } from 'react-icons/fi';
import {
  HiExclamation,
  HiInformationCircle,
  HiOutlineArrowSmRight,
} from 'react-icons/hi';
import TransferStatus from './TransferStatus';
// import { MANUAL_EXIT_RETRIES } from "../../../../config/constants";

interface IReceivalStepProps {
  currentStepNumber: number;
  onNextStep: () => void;
  stepNumber: number;
  transferData: any;
  // hideManualExit: () => void;
  setModalErrored: (modalErrored: boolean) => void;
  refreshSelectedTokenBalance: () => void;
  setReceivalState: (state: Status) => void;
  // showManualExit: () => void;
  receivalState: Status;
  startTime: Date | undefined;
  endTime: Date | undefined;
}

function ReceivalStep({
  currentStepNumber,
  // hideManualExit,
  setModalErrored,
  onNextStep,
  refreshSelectedTokenBalance,
  setReceivalState,
  // showManualExit,
  stepNumber,
  transferData,
  receivalState,
  startTime,
  endTime,
}: IReceivalStepProps) {
  const active = currentStepNumber >= stepNumber;

  const {
    checkReceival,
    exitHash,
    setExitHash,
    gasTokenSwapData,
    executeDepositValue,
    fetchTransactionFeeStatus,
  } = useTransaction()!;

  const {
    fromChain,
    selectedToken,
    toChainRpcUrlProvider,
    toChain,
    transactionFee,
    transferAmount,
  } = transferData;

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

      {receivalError ? (
        <TransferStatus>
          <span className="tw-hw-text-red-400">
            {receivalError?.message || receivalError.toString()}
          </span>
        </TransferStatus>
      ) : null}

      {receivalState === Status.SUCCESS ? (
        <TransferStatus
          style={{
            backgroundColor: '#03A55A25',
          }}
        >
          <span className="tw-hw-text-hyphen-success-100">
            Bridging complete! 😎
          </span>
        </TransferStatus>
      ) : (
        <TransferStatus>
          <span className="tw-hw-text-hyphen-gray-400">
            Bridging in progress...
          </span>
        </TransferStatus>
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
        <article className="tw-hw-flex tw-hw-items-center tw-hw-justify-center tw-hw-rounded-[10px] tw-hw-bg-red-300 tw-hw-bg-opacity-25 tw-hw-p-2 tw-hw-text-red-700">
          <HiExclamation className="tw-hw-mr-3 tw-hw-h-3 tw-hw-w-3" />
          <p className="tw-hw-text-left tw-hw-text-xxs tw-hw-font-bold tw-hw-uppercase">
            Please do not refresh or change network.
          </p>
        </article>
      )}
    </>
  );
}

export default ReceivalStep;
