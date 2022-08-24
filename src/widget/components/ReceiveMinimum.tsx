import CustomTooltip from 'components/CustomTooltip';
import { useToken } from 'context/Token';
import { useTransaction } from 'context/Transaction';
import { Status } from 'hooks/useLoading';
import { HiInformationCircle } from 'react-icons/hi';
import noSelectIcon from 'assets/images/no-select-icon.svg';

function ReceiveMinimum() {
  const { selectedToken } = useToken()!;
  const {
    transferAmountInputValue,
    transactionFee,
    fetchTransactionFeeStatus,
  } = useTransaction()!;

  return (
    <>
      <div className="relative flex flex-col">
        <label className="pl-5 text-xxs font-bold uppercase text-hyphen-gray-400">
          Receive Minimum
        </label>
        <div className="mt-2 flex h-15 w-full items-center rounded-2.5 rounded-r-none border border-r-0 bg-white px-4 py-2 font-mono text-2xl text-hyphen-gray-400 focus:outline-none">
          {fetchTransactionFeeStatus === Status.SUCCESS && transactionFee
            ? transactionFee.amountToGetProcessedString
            : '0.000'}
        </div>
        <div
          className="absolute right-3 inline-flex items-center text-xxs font-bold uppercase text-hyphen-gray-300"
          data-tip
          data-for="totalFees"
        >
          <HiInformationCircle className="mr-1 h-2.5 w-2.5" />
          {fetchTransactionFeeStatus === Status.PENDING ||
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
          </CustomTooltip>
        ) : null}
      </div>
      <div className="mt-[23px] flex h-15 w-full items-center rounded-2.5 rounded-l-none border bg-white px-4 py-2 text-sm text-hyphen-gray-400 focus:outline-none xl:text-base">
        {selectedToken ? (
          <>
            <img
              className="mr-2 h-4 w-4 xl:h-5 xl:w-5"
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
              className="mr-2 h-4 w-4 xl:h-5 xl:w-5"
            />
            ...
          </>
        )}
      </div>
    </>
  );
}

export default ReceiveMinimum;
