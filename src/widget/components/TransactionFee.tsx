import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { HiExclamation, HiInformationCircle } from 'react-icons/hi';
import { Transition } from 'react-transition-group';
import { twMerge } from 'tailwind-merge';
import { useChains } from 'context/Chains';
import { useToken } from 'context/Token';
import { useTransaction } from 'context/Transaction';
import { Status } from 'hooks/useLoading';
import isToChainEthereum from 'utils/isToChainEthereum';
import CustomTooltip from 'components/CustomTooltip';

interface ITransactionFeeProps {}

const TransactionFee: React.FunctionComponent<ITransactionFeeProps> = () => {
  const {
    enableGasTokenSwap,
    gasTokenSwapData,
    transferAmountInputValue,
    transactionFee,
    fetchTransactionFeeStatus,
  } = useTransaction()!;
  const { selectedToken } = useToken()!;
  const { toChain } = useChains()!;
  const showEthereumDisclaimer = toChain
    ? isToChainEthereum(toChain.chainId)
    : false;

  const totalFee = transactionFee
    ? Number.parseFloat(transactionFee.lpFeeProcessedString) +
      Number.parseFloat(transactionFee.transactionFeeProcessedString) -
      Number.parseFloat(transactionFee.rewardAmountString || '0')
    : undefined;

  const showTranasctionFee =
    (fetchTransactionFeeStatus === Status.PENDING ||
      fetchTransactionFeeStatus === Status.SUCCESS) &&
    transferAmountInputValue !== '' &&
    (!enableGasTokenSwap ||
      (enableGasTokenSwap &&
        gasTokenSwapData &&
        gasTokenSwapData.gasTokenPercentage > 0 &&
        gasTokenSwapData.gasTokenPercentage <= 80));

  return (
    <Transition in={showTranasctionFee} timeout={300}>
      {(state) => (
        <div
          className={twMerge(
            'tw-hw-invisible tw-hw-transition-opacity',
            state === 'entering' && 'tw-hw-visible tw-hw-opacity-100',
            state === 'entered' && 'tw-hw-visible tw-hw-opacity-100',
            state === 'exiting' && 'tw-hw-visible tw-hw-opacity-0',
            state === 'exited' && 'tw-hw-invisible tw-hw-opacity-0'
          )}
        >
          <div className="tw-hw-mx-10 tw-hw-rounded-b-lg tw-hw-border-x tw-hw-border-b tw-hw-border-white/10 tw-hw-bg-gray-700">
            <div className="tw-hw-flex tw-hw-flex-col tw-hw-gap-y-2 tw-hw-p-4 tw-hw-text-sm tw-hw-text-white/75">
              {showEthereumDisclaimer ? (
                <article className="tw-hw-mb-2 tw-hw-flex tw-hw-items-start tw-hw-rounded-xl tw-hw-bg-red-100 tw-hw-p-2 tw-hw-text-sm tw-hw-text-red-600">
                  <HiExclamation className="tw-hw-mr-2 tw-hw-h-6 tw-hw-w-auto" />
                  <p>
                    The received amount may differ due to gas price fluctuations
                    on Ethereum.
                  </p>
                </article>
              ) : null}

              <div className="tw-hw-flex tw-hw-items-center tw-hw-justify-between tw-hw-font-medium">
                <div className="tw-hw-flex tw-hw-items-center">
                  <HiInformationCircle
                    data-tip
                    data-for="lpFee"
                    className="tw-hw-mr-2"
                  />
                  {transactionFee ? (
                    <CustomTooltip id="lpFee">
                      <div>
                        <span>
                          LP fee ({transactionFee.transferFeePercentage}%):{' '}
                        </span>
                        {fetchTransactionFeeStatus === Status.SUCCESS &&
                        transactionFee ? (
                          <>{`${transactionFee.lpFeeProcessedString} ${selectedToken?.symbol}`}</>
                        ) : (
                          <Skeleton
                            baseColor="#ffffff10"
                            enableAnimation
                            highlightColor="#615ccd05"
                            className="!tw-hw-w-12"
                          />
                        )}
                      </div>
                      {transactionFee && transactionFee.rewardAmountString ? (
                        <div>
                          <span>Reward amount: </span>
                          {fetchTransactionFeeStatus === Status.SUCCESS &&
                          transactionFee ? (
                            <>{`${transactionFee.rewardAmountString} ${selectedToken?.symbol}`}</>
                          ) : (
                            <Skeleton
                              baseColor="#ffffff10"
                              enableAnimation
                              highlightColor="#615ccd05"
                              className="!tw-hw-w-12"
                            />
                          )}
                        </div>
                      ) : null}
                      <div>
                        <span>Transaction fee: </span>
                        {fetchTransactionFeeStatus === Status.SUCCESS &&
                        transactionFee ? (
                          <>{`${transactionFee.transactionFeeProcessedString} ${selectedToken?.symbol}`}</>
                        ) : (
                          <Skeleton
                            baseColor="#ffffff10"
                            enableAnimation
                            highlightColor="#615ccd05"
                            className="!tw-hw-w-12"
                          />
                        )}
                      </div>
                    </CustomTooltip>
                  ) : null}
                  Total fee
                </div>
                <div className="tw-hw-text-right tw-hw-font-mono">
                  {fetchTransactionFeeStatus === Status.SUCCESS &&
                  transactionFee ? (
                    <>{`${totalFee?.toFixed(5)} ${selectedToken?.symbol}`}</>
                  ) : (
                    <Skeleton
                      baseColor="#ffffff10"
                      enableAnimation
                      highlightColor="#615ccd05"
                      className="!tw-hw-w-32"
                    />
                  )}
                </div>
              </div>

              <div className="tw-hw-flex tw-hw-items-center tw-hw-justify-between tw-hw-font-medium">
                <div className="tw-hw-flex tw-hw-items-center">
                  <HiInformationCircle
                    data-tip
                    data-for="minimumFunds"
                    className="tw-hw-mr-2"
                  />
                  {toChain ? (
                    <CustomTooltip id="minimumFunds">
                      <span>
                        Minimum funds you will get on {toChain.name}. Actual
                        amount may vary slightly based on on-chain data.
                      </span>
                    </CustomTooltip>
                  ) : null}
                  You get minimum
                </div>
                <div className="tw-hw-text-right tw-hw-font-mono">
                  {fetchTransactionFeeStatus === Status.SUCCESS &&
                  transactionFee ? (
                    <>{`${transactionFee.amountToGetProcessedString} ${selectedToken?.symbol}`}</>
                  ) : (
                    <Skeleton
                      baseColor="#ffffff10"
                      enableAnimation
                      highlightColor="#615ccd05"
                      className="!tw-hw-w-32"
                    />
                  )}
                </div>
              </div>

              {gasTokenSwapData &&
              gasTokenSwapData?.gasTokenAmountInDepositCurrency ? (
                <div className="tw-hw-flex tw-hw-items-center tw-hw-justify-between tw-hw-font-medium">
                  <div className="tw-hw-flex tw-hw-items-center">
                    <HiInformationCircle
                      data-tip
                      data-for="gasTokenWorth"
                      className="tw-hw-mr-2"
                    />
                    {toChain ? (
                      <CustomTooltip id="gasTokenWorth">
                        <span>
                          The {selectedToken?.symbol} amount which will be
                          swapped for gas on {toChain.name}.
                        </span>
                      </CustomTooltip>
                    ) : null}
                    Gas token worth
                  </div>
                  <div className="tw-hw-text-right tw-hw-font-mono">
                    {gasTokenSwapData ? (
                      <>{`${gasTokenSwapData?.gasTokenAmountInDepositCurrency.toFixed(
                        5
                      )} ${selectedToken?.symbol}`}</>
                    ) : (
                      <Skeleton
                        baseColor="#ffffff10"
                        enableAnimation
                        highlightColor="#615ccd05"
                        className="!tw-hw-w-32"
                      />
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </Transition>
  );
};

export default TransactionFee;
