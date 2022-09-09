import PrimaryButton from 'components/Buttons/PrimaryButton';
import { Toggle } from 'components/Toggle';
import React, { useState } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';

import { Dialog } from '@headlessui/react';
import Modal from 'components/Modal';

export interface IApprovalModalProps {
  executeTokenApproval: (isInfiniteApproval: boolean, amount: number) => void;
  isVisible: boolean;
  onClose: () => void;
  selectedChainName: string;
  selectedTokenName: string;
  transferAmount: number;
}

export const ApprovalModal: React.FC<IApprovalModalProps> = ({
  executeTokenApproval,
  isVisible,
  onClose,
  selectedChainName,
  selectedTokenName,
  transferAmount,
}) => {
  const [infiniteApproval, setInfiniteApproval] = useState(true);

  return (
    <Modal isVisible={isVisible} onClose={onClose}>
      <div className="tw-hw-relative tw-hw-z-20 tw-hw-mx-auto tw-hw-w-[330px] tw-hw-overflow-hidden tw-hw-rounded-10 tw-hw-border tw-hw-border-hyphen-purple-darker/50 tw-hw-bg-white tw-hw-shadow-lg">
        <div className="tw-hw-mb-7.5 tw-hw-flex tw-hw-items-center tw-hw-justify-between tw-hw-px-7.5 tw-hw-pt-7.5 xl:tw-hw-px-12.5 xl:tw-hw-pt-12.5">
          <Dialog.Title
            as="h1"
            className="tw-hw-text-xl tw-hw-font-semibold tw-hw-text-gray-700"
          >
            Token Approval
          </Dialog.Title>
          <button
            onClick={onClose}
            className="tw-hw-rounded hover:tw-hw-bg-gray-100"
          >
            <IoMdClose className="tw-hw-h-6 tw-hw-w-auto tw-hw-text-gray-500" />
          </button>
        </div>

        <aside className="tw-hw-flex tw-hw-flex-col tw-hw-items-start tw-hw-px-7.5 tw-hw-pb-7.5 xl:tw-hw-px-12.5 xl:tw-hw-pb-12.5">
          <p className="tw-hw-mb-7.5 tw-hw-text-base tw-hw-text-hyphen-purple">
            Allow Hyphen to spend {selectedTokenName} on {selectedChainName}
          </p>

          <div className="tw-hw-mb-7.5 tw-hw-flex tw-hw-items-center tw-hw-justify-center tw-hw-gap-4">
            <span className="tw-hw-flex tw-hw-items-center tw-hw-gap-2 tw-hw-text-xxs tw-hw-font-bold tw-hw-uppercase tw-hw-text-hyphen-purple">
              <FaInfoCircle />
              Infinite Approval
            </span>

            <Toggle
              bgColor="#00D28F"
              enabled={infiniteApproval}
              label="Infinite Approval"
              onToggle={setInfiniteApproval}
              variant="large"
            />
          </div>

          <p className="tw-hw-mb-7.5 tw-hw-text-base tw-hw-text-hyphen-gray-300">
            Note: This approval will only be used when you deposit your{' '}
            {selectedTokenName} in Hyphen contracts on {selectedChainName} for
            cross chain transfers.
          </p>

          <PrimaryButton
            className="tw-hw-w-full tw-hw-px-8"
            onClick={() => {
              if (!transferAmount) throw new Error('Transfer Amount Invalid');
              executeTokenApproval(infiniteApproval, transferAmount);
              onClose();
            }}
          >
            Proceed
          </PrimaryButton>
        </aside>
      </div>
    </Modal>
  );
};

export default ApprovalModal;
