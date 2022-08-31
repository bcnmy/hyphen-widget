import { Dialog, Transition } from '@headlessui/react';
import Modal from 'components/Modal';
import { Fragment, useEffect, useState } from 'react';
import loadingSpinner from 'assets/images/loading-spinner.svg';
import PrimaryButton from 'components/Buttons/PrimaryButton';
import { HiExclamation } from 'react-icons/hi';
import { useTransaction } from 'context/Transaction';
import { Status } from 'hooks/useLoading';
import { useToken } from 'context/Token';

export interface ITransferModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

function TransferModalNew({ isOpen, closeModal }: ITransferModalProps) {
  const {
    executePreDepositCheck,
    executePreDepositCheckError,
    executePreDepositCheckStatus,
    executeDeposit,
    executeDepositStatus,
    executeDepositValue,
    executeDepositError,
    checkReceival,
    receiver: { receiverAddress },
  } = useTransaction()!;
  const { refreshSelectedTokenBalance } = useToken()!;

  const [exitHash, setExitHash] = useState('');
  const [deposited, setDeposited] = useState(false);

  // useEffect(() => {
  //   console.log('useEffect 1 fired!');
  //   executePreDepositCheck();
  //   if (executePreDepositCheckStatus === Status.SUCCESS) {
  //     executeDeposit(receiverAddress);
  //   }
  // }, [
  //   executeDeposit,
  //   executePreDepositCheck,
  //   executePreDepositCheckStatus,
  //   receiverAddress,
  // ]);

  // useEffect(() => {
  //   console.log('useEffect 2 fired!');
  //   if (executeDepositStatus === Status.SUCCESS) {
  //     (async () => {
  //       await executeDepositValue.wait(1);
  //       setDeposited(true);
  //     })();
  //   }
  // }, [executeDepositStatus, executeDepositValue]);

  // useEffect(() => {
  //   console.log('useEffect 3 fired!');
  //   if (deposited) {
  //     let tries = 0;
  //     let keepChecking = setInterval(async () => {
  //       try {
  //         tries++;
  //         let hash = await checkReceival();
  //         if (hash) {
  //           clearInterval(keepChecking);
  //           // hideManualExit();
  //           refreshSelectedTokenBalance();
  //           setExitHash(hash);
  //         }
  //         // else if (tries > MANUAL_EXIT_RETRIES) {
  //         //   showManualExit();
  //         // }
  //         else if (tries > 300) {
  //           clearInterval(keepChecking);
  //           throw new Error('exhauseted max retries');
  //         }
  //       } catch (e) {
  //         console.error(e);
  //       }
  //     }, 5000);
  //   }
  // }, [checkReceival, deposited, refreshSelectedTokenBalance]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
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

                <img
                  src={loadingSpinner}
                  alt="Loading..."
                  className="mx-auto mb-auto animate-spin"
                />

                <PrimaryButton className="mb-3 bg-hyphen-gray-100 text-base font-semibold text-hyphen-gray-400">
                  Checking Available Liquidity...
                </PrimaryButton>

                <article className="flex items-center justify-center rounded-[10px] bg-hyphen-warning bg-opacity-25 p-2 text-hyphen-warning">
                  <HiExclamation className="mr-2 h-3 w-3" />
                  <p className="text-xxs font-bold uppercase">
                    Please do not refresh or change network.
                  </p>
                </article>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default TransferModalNew;
