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
  const { poolInfo, getPoolInfoStatus } = useHyphen()!;
  const {
    changeTransferAmountInputValue,
    transferAmountInputValue,
    transactionAmountValidationErrors,
  } = useTransaction()!;
  const { selectedTokenBalance } = useToken()!;

  return (
    <div className="relative flex flex-col" data-tip data-for="transferAmount">
      <label className="pl-5 text-xxs font-bold uppercase text-hyphen-gray-400">
        Send
      </label>
      <input
        type="text"
        inputMode="decimal"
        placeholder="0.000"
        value={transferAmountInputValue}
        onChange={(e) => changeTransferAmountInputValue(e.target.value)}
        className={twMerge(
          'mt-2 inline-block h-15 w-full rounded-2.5 rounded-r-none border border-r-0 bg-white px-4 py-2 font-mono text-2xl text-hyphen-gray-400 focus:outline-none',
          disabled && 'cursor-not-allowed bg-gray-200'
        )}
        disabled={disabled}
      />
      <button
        className="absolute right-3 top-[45px] flex h-4 items-center rounded-full bg-hyphen-purple px-1.5 text-xxs text-white"
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
        className={`absolute right-3 inline-flex items-center text-xxs font-bold uppercase text-hyphen-gray-300 
        ${
          transactionAmountValidationErrors.includes(
            ValidationErrors.AMOUNT_LT_MIN || ValidationErrors.AMOUNT_GT_MAX
          ) && 'text-red-600'
        }`}
        data-tip
        data-for="limit"
      >
        <HiInformationCircle className="mr-1 h-2.5 w-2.5" />
        Limit
      </div>
      <CustomTooltip id="limit">
        Min:{' '}
        {getPoolInfoStatus === Status.SUCCESS && poolInfo?.minDepositAmount
          ? Math.trunc(poolInfo.minDepositAmount * 100000) / 100000
          : '...'}
        {' // '}
        Max:{' '}
        {getPoolInfoStatus === Status.SUCCESS && poolInfo?.maxDepositAmount
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
