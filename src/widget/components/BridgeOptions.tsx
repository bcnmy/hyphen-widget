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
      <div className="mt-2 flex flex-col items-center md:flex-row md:items-baseline md:justify-between">
        {showGasTokenSwap ? <GasTokenSwap /> : null}
        {showChangeAddress ? (
          <button
            className="mt-3 flex items-center md:mt-0"
            onClick={handleChangeRecepientClick}
          >
            <HiOutlineChevronDown
              className={`${
                showRecepientInput ? 'rotate-180 transform' : ''
              } mr-1 h-3 w-3 text-hyphen-gray-400`}
            />
            <span className="text-xxs font-bold uppercase text-hyphen-gray-400">
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
          className="mt-2 h-12 w-full rounded-lg border border-gray-200 px-4 text-base text-hyphen-gray-400 focus:border-gray-500 focus-visible:outline-none"
        />
      ) : null}
    </>
  );
}

export default BridgeOptions;
