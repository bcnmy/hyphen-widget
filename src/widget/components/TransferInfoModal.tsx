import React, { useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';

import { Dialog } from '@headlessui/react';
import Modal from 'components/Modal';
import { useTransaction } from 'context/Transaction';
import useAsync from 'hooks/useLoading';
import { ITransferRecord } from 'context/TransactionInfoModal';
import {
  HiOutlineArrowNarrowRight,
  HiOutlineArrowSmRight,
} from 'react-icons/hi';
import { useChains } from 'context/Chains';

export interface ITransferInfoModal {
  transferRecord: ITransferRecord;
  isVisible: boolean;
  onClose: () => void;
}

export const TransferInfoModal: React.FC<ITransferInfoModal> = ({
  transferRecord,
  isVisible,
  onClose,
}) => {
  const { getExitInfoFromHash, gasTokenSwapData } = useTransaction()!;
  const { networks } = useChains()!;

  const { execute: getExitInfo } = useAsync(getExitInfoFromHash);

  const fromChainExplorerUrl = `${
    networks?.find(
      (network) => network.chainId === transferRecord.fromChain.chainId
    )!.explorerUrl
  }/tx/${transferRecord.depositHash}`;

  const toChainExplorerUrl = `${
    networks?.find(
      (network) => network.chainId === transferRecord.toChain.chainId
    )!.explorerUrl
  }/tx/${transferRecord.exitHash}`;

  useEffect(() => {
    getExitInfo(transferRecord.exitHash);
  }, [getExitInfo, transferRecord.exitHash]);

  return (
    <Modal isVisible={isVisible} onClose={() => {}}>
      <div className="tw-hw-relative tw-hw-z-20 tw-hw-rounded-3xl tw-hw-border tw-hw-border-hyphen-purple-darker/50 tw-hw-bg-white tw-hw-p-6 tw-hw-shadow-lg">
        <div className="tw-hw-mb-6 tw-hw-flex tw-hw-items-center tw-hw-justify-between">
          <Dialog.Title
            as="h1"
            className="tw-hw-text-xl tw-hw-font-semibold tw-hw-text-gray-700"
          >
            Transaction details
          </Dialog.Title>
          <button
            onClick={onClose}
            className="tw-hw-rounded hover:tw-hw-bg-gray-100"
          >
            <IoMdClose className="tw-hw-h-6 tw-hw-w-auto tw-hw-text-gray-500" />
          </button>
        </div>

        <article>
          <div className="tw-hw-flex tw-hw-flex-col tw-hw-border-b tw-hw-border-gray-200 tw-hw-pb-4">
            <div className="tw-hw-mb-2 tw-hw-flex tw-hw-items-center tw-hw-justify-between">
              <div className="tw-hw-flex tw-hw-flex-col">
                <span className="tw-hw-text-xs tw-hw-text-gray-400">Sent</span>
                <span className="tw-hw-text-xl tw-hw-font-semibold tw-hw-text-gray-700">
                  {transferRecord.depositAmount} {transferRecord.token.symbol}
                </span>
                <a
                  target="_blank"
                  href={fromChainExplorerUrl}
                  rel="noreferrer"
                  className="tw-hw-flex tw-hw-items-center tw-hw-text-hyphen-purple"
                >
                  {transferRecord.fromChain.name}
                  <HiOutlineArrowSmRight className="tw-hw-h-5 tw-hw-w-5 tw-hw--rotate-45" />
                </a>
              </div>
              <HiOutlineArrowNarrowRight className="tw-hw-h-8 tw-hw-w-8 tw-hw-text-gray-700" />
              <div className="tw-hw-flex tw-hw-flex-col">
                <span className="tw-hw-text-xs tw-hw-text-gray-400">
                  Received
                </span>
                <span className="tw-hw-text-xl tw-hw-font-semibold tw-hw-text-gray-700">
                  ~{transferRecord.transferredAmount}{' '}
                  {transferRecord.token.symbol}
                </span>
                <a
                  target="_blank"
                  href={toChainExplorerUrl}
                  rel="noreferrer"
                  className="tw-hw-flex tw-hw-items-center tw-hw-text-hyphen-purple"
                >
                  {transferRecord.toChain.name}
                  <HiOutlineArrowSmRight className="tw-hw-h-5 tw-hw-w-5 tw-hw--rotate-45" />
                </a>
              </div>
            </div>

            <span className="tw-hw-text-center tw-hw-text-gray-500">
              Transfer completed in{' '}
              <span className="tw-hw-text-hyphen-purple">
                {transferRecord.transferTime}
              </span>
            </span>
          </div>

          <ul className="tw-hw-pt-4">
            <li className="tw-hw-mb-1 tw-hw-flex tw-hw-justify-between">
              <span className="tw-hw-text-gray-500">
                Liquidity provider fee
              </span>
              <span className="tw-hw-text-gray-700">
                {transferRecord.lpFee} {transferRecord.token.symbol}
              </span>
            </li>
            {transferRecord.rewardAmount && (
              <li className="tw-hw-mb-1 tw-hw-flex tw-hw-justify-between">
                <span className="tw-hw-text-gray-500">Reward Amount</span>
                <span className="tw-hw-text-gray-700">
                  {transferRecord.rewardAmount} {transferRecord.token.symbol}
                </span>
              </li>
            )}
            <li className="tw-hw-flex tw-hw-justify-between">
              <span className="tw-hw-text-gray-500">Transaction fee</span>
              <span className="tw-hw-text-gray-700">
                {transferRecord.transactionFee} {transferRecord.token.symbol}
              </span>
            </li>
            {gasTokenSwapData ? (
              <li className="tw-hw-mt-1 tw-hw-flex tw-hw-justify-between">
                <span className="tw-hw-text-gray-500">Gas token worth</span>
                <span className="tw-hw-text-gray-700">
                  {gasTokenSwapData.gasTokenAmountInDepositCurrency}{' '}
                  {transferRecord.token.symbol}
                </span>
              </li>
            ) : null}
          </ul>
        </article>
      </div>
    </Modal>
  );
};

export default TransferInfoModal;
