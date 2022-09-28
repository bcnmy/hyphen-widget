import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { useToken } from 'context/Token';
import { Status } from 'hooks/useLoading';
import CustomTooltip from 'components/CustomTooltip';
import { IoMdClose } from 'react-icons/io';
import DepositStep from './DepositStep';
import PredepositStep from './PredepositStep';
import ReceivalStep from './ReceivalStep';

export interface ITransferModalProps {
  isVisible: boolean;
  onClose: () => void;
  transferModalData: any;
}

export const TransferModal: React.FC<ITransferModalProps> = ({
  isVisible,
  onClose,
  transferModalData,
}) => {
  const [transferData, setTransferData] = useState(transferModalData);

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
                        if (isExitAllowed) {
                          setTransferData(undefined);
                          onClose();
                        }
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
                  <PredepositStep
                    currentStepNumber={activeStep}
                    stepNumber={1}
                    onNextStep={nextStep}
                    setModalErrored={setModalErrored}
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
                    transferData={transferData}
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
                    transferData={transferData}
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
