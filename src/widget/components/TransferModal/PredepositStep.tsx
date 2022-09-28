import loadingSpinner from 'assets/images/loading-spinner.svg';
import { useTransaction } from 'context/Transaction';
import { Status } from 'hooks/useLoading';
import { useEffect, useState } from 'react';
import { HiExclamation } from 'react-icons/hi';

interface IPredepositStepProps {
  currentStepNumber: number;
  onNextStep: () => void;
  stepNumber: number;
  setModalErrored: (modalErrored: boolean) => void;
}

function PredepositStep({
  currentStepNumber,
  stepNumber,
  onNextStep,
  setModalErrored,
}: IPredepositStepProps) {
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
            We were not able to perform pre deposit checks for this transaction.
            Please try again.
          </span>
        ) : (
          <span className="tw-hw-text-hyphen-gray-400">
            Checking available liquidity...
          </span>
        )}
      </span>
      <article className="tw-hw-flex tw-hw-items-center tw-hw-justify-center tw-hw-rounded-[10px] tw-hw-bg-red-300 tw-hw-bg-opacity-25 tw-hw-p-2 tw-hw-text-red-700">
        <HiExclamation className="tw-hw-mr-3 tw-hw-h-3 tw-hw-w-3" />
        <p className="tw-hw-text-left tw-hw-text-xxs tw-hw-font-bold tw-hw-uppercase">
          Please do not refresh or change network.
        </p>
      </article>
    </>
  );
}

export default PredepositStep;
