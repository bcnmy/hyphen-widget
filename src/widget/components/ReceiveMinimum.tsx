import CustomTooltip from 'components/CustomTooltip';
import { useToken } from 'context/Token';
import { useTransaction } from 'context/Transaction';
import { Status } from 'hooks/useLoading';
import { HiInformationCircle } from 'react-icons/hi';
import noSelectIcon from 'assets/images/no-select-icon.svg';

function ReceiveMinimum() {
  const { selectedToken } = useToken()!;
  const {
    gasTokenSwapData,
    transferAmountInputValue,
    transactionFee,
    fetchTransactionFeeStatus,
  } = useTransaction()!;

  return (
    <div className="tw-hw-relative tw-hw-grid tw-hw-grid-cols-[1.5fr_1fr] tw-hw-items-center tw-hw-gap-0 tw-hw-rounded-[20px] tw-hw-bg-bridge-section tw-hw-p-5 sm:tw-hw-grid-cols-[2fr_1fr]">
      <div className="tw-hw-flex tw-hw-flex-col">
        <label className="tw-hw-pl-5 tw-hw-text-xxs tw-hw-font-bold tw-hw-uppercase tw-hw-text-hyphen-gray-400">
          Receive Minimum
        </label>
        <div className="tw-hw-mt-2 tw-hw-flex tw-hw-h-15 tw-hw-w-full tw-hw-items-center tw-hw-rounded-2.5 tw-hw-rounded-r-none tw-hw-border tw-hw-border-r-0 tw-hw-bg-white tw-hw-px-4 tw-hw-py-2 tw-hw-font-mono tw-hw-text-2xl tw-hw-text-hyphen-gray-400 focus:tw-hw-outline-none">
          {fetchTransactionFeeStatus === Status.SUCCESS &&
          transactionFee &&
          transferAmountInputValue !== ''
            ? transactionFee.amountToGetProcessedString
            : '0.000'}
        </div>
        <div
          className="tw-hw-absolute tw-hw-right-8 tw-hw-inline-flex tw-hw-items-center tw-hw-text-xxs tw-hw-font-bold tw-hw-uppercase tw-hw-text-hyphen-gray-300"
          data-tip
          data-for="totalFees"
        >
          <HiInformationCircle className="tw-hw-mr-1 tw-hw-h-2.5 tw-hw-w-2.5" />
          {fetchTransactionFeeStatus === Status.PENDING &&
          transferAmountInputValue !== ''
            ? 'Calculating Total Fees'
            : 'Total Fees'}
        </div>
        {transactionFee ? (
          <CustomTooltip id="totalFees">
            <div>
              <span>LP fee ({transactionFee.transferFeePercentage}%): </span>
              {fetchTransactionFeeStatus === Status.SUCCESS &&
              transactionFee ? (
                <>{`${transactionFee.lpFeeProcessedString} ${selectedToken?.symbol}`}</>
              ) : (
                '...'
              )}
            </div>
            {transactionFee && transactionFee.rewardAmountString ? (
              <div>
                <span>Reward amount: </span>
                {fetchTransactionFeeStatus === Status.SUCCESS &&
                transactionFee ? (
                  <>{`${transactionFee.rewardAmountString} ${selectedToken?.symbol}`}</>
                ) : (
                  '...'
                )}
              </div>
            ) : null}
            <div>
              <span>Transaction fee: </span>
              {fetchTransactionFeeStatus === Status.SUCCESS &&
              transactionFee ? (
                <>{`${transactionFee.transactionFeeProcessedString} ${selectedToken?.symbol}`}</>
              ) : (
                '...'
              )}
            </div>
            {gasTokenSwapData ? (
              <div>
                <span>Gas token worth: </span>
                <>{`${gasTokenSwapData?.gasTokenAmountInDepositCurrency.toFixed(
                  5
                )} ${selectedToken?.symbol}`}</>
              </div>
            ) : null}
          </CustomTooltip>
        ) : null}
      </div>
      <div className="tw-hw-mt-[23px] tw-hw-flex tw-hw-h-15 tw-hw-w-full tw-hw-items-center tw-hw-rounded-2.5 tw-hw-rounded-l-none tw-hw-border tw-hw-bg-white tw-hw-px-4 tw-hw-py-2 tw-hw-text-sm tw-hw-text-hyphen-gray-400 focus:tw-hw-outline-none xl:tw-hw-text-base">
        {selectedToken ? (
          <>
            <img
              className="tw-hw-mr-2 tw-hw-h-4 tw-hw-w-4 xl:tw-hw-h-5 xl:tw-hw-w-5"
              src={selectedToken.image}
              alt={selectedToken.symbol}
            />
            {selectedToken.symbol}
          </>
        ) : (
          <>
            <img
              src={noSelectIcon}
              alt="No selected token"
              className="tw-hw-mr-2 tw-hw-h-4 tw-hw-w-4 xl:tw-hw-h-5 xl:tw-hw-w-5"
            />
            Select token
          </>
        )}
      </div>
    </div>
  );
}

export default ReceiveMinimum;
