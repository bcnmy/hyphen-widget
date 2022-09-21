import { useTransaction } from 'context/Transaction';
import { useState } from 'react';
import { HiOutlineChevronDown } from 'react-icons/hi';
import GasTokenSwap from './GasTokenSwap';

interface IBridgeOptions {
  showChangeAddress?: boolean;
  showGasTokenSwap?: boolean;
}

function BridgeOptions({
  showChangeAddress,
  showGasTokenSwap,
}: IBridgeOptions) {
  const {
    receiver: { receiverAddress },
    changeReceiver,
  } = useTransaction()!;
  const [showRecepientInput, setShowRecepientInput] = useState(false);

  function handleChangeRecepientClick() {
    setShowRecepientInput(!showRecepientInput);
  }

  return (
    <>
      <div className="tw-hw-flex tw-hw-flex-col tw-hw-items-center md:tw-hw-flex-row md:tw-hw-items-baseline md:tw-hw-justify-between">
        {showGasTokenSwap ? <GasTokenSwap /> : null}
        {showChangeAddress ? (
          <button
            className="tw-hw-mt-3 tw-hw-flex tw-hw-items-center md:tw-hw-mt-0"
            onClick={handleChangeRecepientClick}
          >
            <HiOutlineChevronDown
              className={`${
                showRecepientInput ? 'tw-hw-rotate-180 tw-hw-transform' : ''
              } tw-hw-mr-1 tw-hw-h-3 tw-hw-w-3 tw-hw-text-hyphen-gray-400`}
            />
            <span className="tw-hw-text-xxs tw-hw-font-bold tw-hw-uppercase tw-hw-text-hyphen-gray-400">
              Change recepient
            </span>
          </button>
        ) : null}
      </div>
      {showRecepientInput ? (
        <input
          type="text"
          value={receiverAddress}
          onChange={changeReceiver}
          className="tw-hw-mt-2 tw-hw-h-12 tw-hw-w-full tw-hw-rounded-lg tw-hw-border tw-hw-border-gray-200 tw-hw-px-4 tw-hw-text-base tw-hw-text-hyphen-gray-400 focus:tw-hw-border-gray-500 focus-visible:tw-hw-outline-none"
        />
      ) : null}
    </>
  );
}

export default BridgeOptions;
