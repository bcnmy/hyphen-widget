import PrimaryButton from 'components/Buttons/PrimaryButton';
import React from 'react';
import { IoMdClose } from 'react-icons/io';

import { Dialog } from '@headlessui/react';
import Modal from 'components/Modal';
import useErrorModal from 'hooks/useErrorModal';

export interface IErrorModalProps {
  error: any;
  title: string;
}

export const ErrorModal: React.FC<IErrorModalProps> = ({ error, title }) => {
  const { isErrorModalVisible: isVisible, hideErrorModal } =
    useErrorModal(error);

  return (
    <Modal isVisible={isVisible} onClose={hideErrorModal}>
      <div className="tw-hw-mb-14">
        <div className="tw-hw-relative tw-hw-rounded-3xl tw-hw-bg-white tw-hw-p-6 tw-hw-shadow-2xl">
          <div className="tw-hw-absolute tw-hw--inset-2 tw-hw--z-10 tw-hw-rounded-3xl tw-hw-bg-white/60 tw-hw-opacity-50 tw-hw-blur-lg"></div>
          <div className="tw-hw-flex tw-hw-flex-col">
            <div className="tw-hw-mb-6 tw-hw-flex tw-hw-items-center tw-hw-justify-between">
              <Dialog.Title
                as="h1"
                className="tw-hw-p-2 tw-hw-text-xl tw-hw-font-semibold tw-hw-text-black tw-hw-text-opacity-[0.54]"
              >
                {title}
              </Dialog.Title>
              <div className="tw-hw-hover text-hyphen-purple-dark/80 tw-hw-ml-auto">
                <button onClick={hideErrorModal}>
                  <IoMdClose className="tw-hw-h-6 tw-hw-w-auto" />
                </button>
              </div>
            </div>
            <div className="tw-hw-rounded-xl tw-hw-border tw-hw-border-hyphen-purple tw-hw-border-opacity-10 tw-hw-bg-hyphen-purple tw-hw-bg-opacity-[0.05] tw-hw-px-4 tw-hw-py-6 tw-hw-transition-colors hover:tw-hw-border-opacity-30">
              <Dialog.Description
                as="div"
                className="tw-hw-text tw-hw-py-2 tw-hw-text-center tw-hw-font-medium tw-hw-text-hyphen-purple-dark/80"
              >
                {error?.message}
              </Dialog.Description>
            </div>
            <div className="tw-hw-mt-4 tw-hw-flex tw-hw-justify-center tw-hw-pt-3 tw-hw-pb-2">
              <PrimaryButton
                className="tw-hw-px-8"
                onClick={() => {
                  hideErrorModal();
                }}
              >
                Okay
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ErrorModal;
