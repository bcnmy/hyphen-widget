import { Dialog, Transition } from '@headlessui/react';
import Modal from 'components/Modal';
import { Fragment, useEffect, useState } from 'react';
import loadingSpinner from 'assets/images/loading-spinner.svg';
import arrowRight from 'assets/images/arrow-right.svg';
import bridgingCompleteArrow from 'assets/images/bridging-complete-arrow.svg';
import PrimaryButton from 'components/Buttons/PrimaryButton';
import {
  HiExclamation,
  HiInformationCircle,
  HiOutlineArrowRight,
  HiOutlineArrowSmRight,
} from 'react-icons/hi';
import { AiFillThunderbolt } from 'react-icons/ai';
import { FiArrowUpRight } from 'react-icons/fi';
import { useTransaction } from 'context/Transaction';
import { Status } from 'hooks/useLoading';
import { useToken } from 'context/Token';
import { useChains } from 'context/Chains';

export interface ITransferModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

function TransferModalNew({ isOpen, closeModal }: ITransferModalProps) {
  const { fromChain, toChain } = useChains()!;
  const { refreshSelectedTokenBalance, selectedToken } = useToken()!;
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
    transferAmountInputValue,
  } = useTransaction()!;

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

                {/* Pre-deposit step */}
                {/* <img
                  src={loadingSpinner}
                  alt="Loading..."
                  className="mx-auto mb-auto animate-spin"
                />

                <PrimaryButton className="mb-3 bg-hyphen-gray-100 text-base font-semibold text-hyphen-gray-400">
                  Checking available liquidity...
                </PrimaryButton>

                <article className="flex items-center justify-center rounded-[10px] bg-hyphen-warning bg-opacity-25 p-2 text-hyphen-warning">
                  <HiExclamation className="mr-2 h-3 w-3" />
                  <p className="text-xxs font-bold uppercase">
                    Please do not refresh or change network.
                  </p>
                </article> */}

                {/* Deposit step */}
                {/* <article className="mb-auto grid grid-cols-3">
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
                    <a
                      href="/"
                      className="flex items-center rounded-full bg-hyphen-purple px-[10px] py-1 text-xxs font-bold uppercase text-white"
                    >
                      Source Tx
                      <FiArrowUpRight className="h-3 w-3" />
                    </a>
                  </div>

                  <div className="flex flex-col items-center justify-center">
                    <img
                      src={arrowRight}
                      alt="Deposit direction"
                      className="mb-8"
                    />
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
                    <a
                      href="/"
                      className="flex items-center rounded-full bg-hyphen-gray-300 px-[10px] py-1 text-xxs font-bold uppercase text-white"
                    >
                      Destination Tx
                      <FiArrowUpRight className="h-3 w-3" />
                    </a>
                  </div>
                </article> */}

                {/* Receival Step */}
                <article className="mb-auto grid grid-cols-3">
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
                    <a
                      href="/"
                      className="flex items-center rounded-full bg-hyphen-purple px-[10px] py-1 text-xxs font-bold uppercase text-white"
                    >
                      Source Tx
                      <FiArrowUpRight className="h-3 w-3" />
                    </a>
                  </div>

                  <div className="flex flex-col items-center justify-center">
                    <img
                      src={arrowRight}
                      alt="Deposit direction"
                      className="mb-8"
                    />
                    <img
                      src={bridgingCompleteArrow}
                      alt="Bridging complete confirmation"
                      className="mx-auto h-[60px]"
                    />
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
                    <a
                      href="/"
                      className="flex items-center rounded-full bg-hyphen-purple px-[10px] py-1 text-xxs font-bold uppercase text-white"
                    >
                      Destination Tx
                      <FiArrowUpRight className="h-3 w-3" />
                    </a>
                  </div>
                </article>

                <PrimaryButton className="mb-3 bg-hyphen-success bg-opacity-25 text-base font-semibold text-hyphen-gray-400">
                  Bridging completed! 😎
                </PrimaryButton>

                <div className="mt-1 flex items-center justify-center">
                  <span className="text-xxs font-bold uppercase text-hyphen-gray-400">
                    {fromChain?.name}
                  </span>
                  <HiOutlineArrowSmRight className="mx-1 h-3 w-3 text-hyphen-purple" />
                  <span className="text-xxs font-bold uppercase text-hyphen-gray-400">
                    {toChain?.name}
                  </span>
                  <span className="mx-1 text-xxs">⚡</span>
                  <div
                    className="flex items-center"
                    data-tip
                    data-for="totalFees"
                  >
                    <HiInformationCircle className="mr-1 h-2.5 w-2.5 text-hyphen-gray-300" />
                    <span className="text-xxs font-bold uppercase text-hyphen-gray-300">
                      Total fees
                    </span>
                  </div>
                </div>

                {/* <article className="flex items-center justify-center rounded-[10px] bg-hyphen-warning bg-opacity-25 p-2 text-hyphen-warning">
                  <HiExclamation className="mr-2 h-3 w-3" />
                  <p className="text-xxs font-bold uppercase">
                    Please do not refresh or change network.
                  </p>
                </article> */}
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default TransferModalNew;
