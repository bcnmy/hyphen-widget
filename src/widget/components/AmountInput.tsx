import CustomTooltip from 'components/CustomTooltip';
import { useHyphen } from 'context/Hyphen';
import { useToken } from 'context/Token';
import { useTransaction, ValidationErrors } from 'context/Transaction';
import { Status } from 'hooks/useLoading';
import React from 'react';
import { HiInformationCircle } from 'react-icons/hi';
import { twMerge } from 'tailwind-merge';

interface IAmountInputProps {
  disabled?: boolean;
}

const AmountInput: React.FunctionComponent<IAmountInputProps> = ({
  disabled,
}) => {
  const { poolInfo, isPoolInfoAvailable } = useHyphen()!;
  const {
    changeTransferAmountInputValue,
    transferAmountInputValue,
    transactionAmountValidationErrors,
  } = useTransaction()!;
  const { selectedTokenBalance } = useToken()!;

  return (
    <div
      className="tw-hw-relative tw-hw-flex tw-hw-flex-col"
      data-tip
      data-for="transferAmount"
    >
      <label className="tw-hw-pl-5 tw-hw-text-xxs tw-hw-font-bold tw-hw-uppercase tw-hw-text-hyphen-gray-400">
        Send
      </label>
      <input
        type="text"
        inputMode="decimal"
        placeholder="0.000"
        value={transferAmountInputValue}
        onChange={(e) => changeTransferAmountInputValue(e.target.value)}
        className={twMerge(
          'tw-hw-mt-2 tw-hw-inline-block tw-hw-h-15 tw-hw-w-full tw-hw-rounded-2.5 tw-hw-border tw-hw-bg-white tw-hw-px-4 tw-hw-py-2 tw-hw-font-mono tw-hw-text-2xl tw-hw-text-hyphen-gray-400 focus:tw-hw-outline-none md:tw-hw-rounded-r-none md:tw-hw-border-r-0',
          disabled && 'tw-hw-cursor-not-allowed tw-hw-bg-gray-200'
        )}
        disabled={disabled}
      />
      <button
        className="tw-hw-absolute tw-hw-top-[45px] tw-hw-right-3 tw-hw-flex tw-hw-h-4 tw-hw-items-center tw-hw-rounded-full tw-hw-bg-hyphen-purple tw-hw-px-1.5 tw-hw-text-xxs tw-hw-text-white"
        onClick={() => {
          selectedTokenBalance &&
            poolInfo &&
            parseFloat(selectedTokenBalance.formattedBalance) &&
            changeTransferAmountInputValue(
              (
                Math.trunc(
                  Math.min(
                    parseFloat(selectedTokenBalance?.displayBalance),
                    poolInfo?.maxDepositAmount
                  ) * 1000
                ) / 1000
              ).toString()
            );
        }}
      >
        MAX
      </button>
      <div
        className={`tw-hw-absolute tw-hw-right-3 tw-hw-inline-flex tw-hw-items-center tw-hw-text-xxs tw-hw-font-bold tw-hw-uppercase tw-hw-text-hyphen-gray-300 
        ${
          transactionAmountValidationErrors.includes(
            ValidationErrors.AMOUNT_LT_MIN || ValidationErrors.AMOUNT_GT_MAX
          ) && 'tw-hw-text-red-600'
        }`}
        data-tip
        data-for="limit"
      >
        <HiInformationCircle className="tw-hw-mr-1 tw-hw-h-2.5 tw-hw-w-2.5" />
        Limit
      </div>
      <CustomTooltip id="limit">
        Min:{' '}
        {isPoolInfoAvailable && poolInfo?.minDepositAmount
          ? Math.trunc(poolInfo.minDepositAmount * 100000) / 100000
          : '...'}
        {' // '}
        Max:{' '}
        {isPoolInfoAvailable && poolInfo?.maxDepositAmount
          ? Math.trunc(poolInfo.maxDepositAmount * 100000) / 100000
          : '...'}
      </CustomTooltip>
      {disabled && (
        <CustomTooltip id="transferAmount">
          <span>Select source & destination chains</span>
        </CustomTooltip>
      )}
    </div>
  );
};

export default AmountInput;
