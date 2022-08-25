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
      <div className="relative z-20 mx-auto w-full overflow-hidden rounded-[25px] border border-hyphen-purple-darker/50 bg-white shadow-lg xl:w-[21.875rem]">
        <div className="mb-7.5 px-7.5 pt-7.5 flex items-center justify-between xl:px-12.5 xl:pt-12.5">
          <Dialog.Title as="h1" className="text-xl font-semibold text-gray-700">
            Token Approval
          </Dialog.Title>
          <button onClick={onClose} className="rounded hover:bg-gray-100">
            <IoMdClose className="h-6 w-auto text-gray-500" />
          </button>
        </div>

        <aside className="px-7.5 pb-7.5 flex flex-col items-start xl:px-12.5 xl:pb-12.5">
          <p className="mb-7.5 text-base text-hyphen-purple">
            Allow Hyphen to spend {selectedTokenName} on {selectedChainName}
          </p>

          <div className="mb-7.5 flex items-center justify-center gap-4">
            <span className="flex items-center gap-2 text-xxs font-bold uppercase text-hyphen-purple">
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

          <p className="mb-7.5 text-base text-hyphen-gray-300">
            Note: This approval will only be used when you deposit your{' '}
            {selectedTokenName} in Hyphen contracts on {selectedChainName} for
            cross chain transfers.
          </p>

          <PrimaryButton
            className="px-8"
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
