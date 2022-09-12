import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, HTMLAttributes } from 'react';

interface IModalProps extends HTMLAttributes<HTMLDivElement> {
  isVisible: boolean;
  onClose: () => void;
}

const Modal: React.FunctionComponent<IModalProps> = ({
  isVisible,
  onClose,
  children,
}) => {
  return (
    <Transition appear show={isVisible} as={Fragment}>
      <Dialog
        as="div"
        className="tw-hw-fixed tw-hw-inset-0 tw-hw-z-20 tw-hw-flex tw-hw-justify-center tw-hw-px-2"
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="tw-hw-ease-out tw-hw-duration-300"
          enterFrom="tw-hw-opacity-0"
          enterTo="tw-hw-opacity-100"
          leave="tw-hw-ease-in tw-hw-duration-200"
          leaveFrom="tw-hw-opacity-100"
          leaveTo="tw-hw-opacity-0"
        >
          <Dialog.Overlay className="tw-hw-absolute tw-hw-inset-0 tw-hw-bg-black tw-hw-bg-opacity-40 tw-hw-backdrop-blur-[2px] firefox:tw-hw-bg-opacity-70" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="tw-hw-ease-out tw-hw-duration-300"
          enterFrom="tw-hw-opacity-0 tw-hw-scale-95"
          enterTo="tw-hw-opacity-100 tw-hw-scale-100"
          leave="tw-hw-ease-in tw-hw-duration-200"
          leaveFrom="tw-hw-opacity-100 tw-hw-scale-100"
          leaveTo="tw-hw-opacity-0 tw-hw-scale-95"
        >
          <div className="tw-hw-flex tw-hw-max-w-lg tw-hw-flex-grow tw-hw-flex-col">
            <div className="tw-hw-relative tw-hw-my-auto">{children}</div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default Modal;
