import PrimaryButton from 'components/Buttons/PrimaryButton';
import Spinner from 'components/Buttons/Spinner';
import { useBiconomy } from 'context/Biconomy';
import { useChains } from 'context/Chains';
import { useTokenApproval } from 'context/TokenApproval';
import { useTransaction } from 'context/Transaction';
import { useWalletProvider } from 'context/WalletProvider';
import { Status } from 'hooks/useLoading';
import * as React from 'react';
import switchNetwork from 'utils/switchNetwork';
import CustomTooltip from 'components/CustomTooltip';

export interface ICallToActionProps {
  onApproveButtonClick: () => void;
  onTransferButtonClick: () => void;
}

export const CallToAction: React.FC<ICallToActionProps> = ({
  onApproveButtonClick,
  onTransferButtonClick,
}) => {
  const {
    executeApproveTokenStatus,
    fetchSelectedTokenApprovalError,
    fetchSelectedTokenApprovalStatus,
    fetchSelectedTokenApprovalValue,
  } = useTokenApproval()!;

  const { fromChain } = useChains()!;
  const { walletProvider, currentChainId, connect, isLoggedIn } =
    useWalletProvider()!;
  const {
    receiver: { isReceiverValid },
    transactionAmountValidationErrors,
    enableGasTokenSwap,
    gasTokenSwapData,
  } = useTransaction()!;
  const { isBiconomyEnabled } = useBiconomy()!;

  if (!isLoggedIn) {
    return (
      <div className="mt-8 grid grid-cols-1">
        <PrimaryButton onClick={() => connect()}>Connect Wallet</PrimaryButton>
      </div>
    );
  }

  if (!isBiconomyEnabled && fromChain?.chainId !== currentChainId) {
    return (
      <div className="mt-8 grid grid-cols-1">
        <PrimaryButton
          onClick={() => {
            if (!walletProvider || !fromChain)
              throw new Error('Prerequisites missing');
            switchNetwork(walletProvider, fromChain);
          }}
        >
          Switch to {fromChain?.name}
        </PrimaryButton>
      </div>
    );
  }

  if (!isReceiverValid) {
    return (
      <div className="mt-8 grid grid-cols-1">
        <span data-tip data-for="invalidReceiverAddress">
          <PrimaryButton disabled>Invalid receiver address</PrimaryButton>
        </span>
        <CustomTooltip id="invalidReceiverAddress">
          <span>
            This receiver address is not valid, please check the address and try
            again.
          </span>
        </CustomTooltip>
      </div>
    );
  }

  return (
    <div className="mt-8 grid grid-cols-1">
      {fetchSelectedTokenApprovalStatus === Status.IDLE ||
      transactionAmountValidationErrors.length > 0 ||
      fetchSelectedTokenApprovalError ? (
        <>
          <span data-tip data-for="whyTransferDisabled">
            <PrimaryButton disabled>Transfer</PrimaryButton>
          </span>
          <CustomTooltip id="whyTransferDisabled">
            {fetchSelectedTokenApprovalError &&
            transactionAmountValidationErrors.length === 0 ? (
              <span>Error trying to fetch token approval</span>
            ) : (
              <span>Enter a valid transfer amount</span>
            )}
          </CustomTooltip>
        </>
      ) : (
        <>
          {fetchSelectedTokenApprovalStatus === Status.PENDING && (
            <>
              <div
                data-tip
                data-for="whyTransferDisabled"
                className="flex items-center"
              >
                {fetchSelectedTokenApprovalValue === false ? (
                  <PrimaryButton disabled className="mr-8">
                    Approve
                  </PrimaryButton>
                ) : null}
                <PrimaryButton disabled className="flex items-center gap-2">
                  <Spinner />
                  Transfer
                </PrimaryButton>
              </div>
              <CustomTooltip id="whyTransferDisabled">
                <span>Approval loading</span>
              </CustomTooltip>
            </>
          )}
          {fetchSelectedTokenApprovalStatus === Status.SUCCESS &&
            fetchSelectedTokenApprovalValue === false && (
              <>
                {executeApproveTokenStatus === Status.PENDING ? (
                  <PrimaryButton disabled>
                    <span className="flex items-center gap-2">
                      <Spinner />
                      <span>Approve</span>
                    </span>
                  </PrimaryButton>
                ) : (
                  <PrimaryButton onClick={onApproveButtonClick}>
                    Approve
                  </PrimaryButton>
                )}
                <span data-tip data-for="whyTransferDisabled">
                  <PrimaryButton disabled>Transfer</PrimaryButton>
                </span>
                <CustomTooltip id="whyTransferDisabled">
                  <span>Approve token to enable token transfers</span>
                </CustomTooltip>
              </>
            )}

          {fetchSelectedTokenApprovalStatus === Status.SUCCESS &&
            fetchSelectedTokenApprovalValue === true &&
            enableGasTokenSwap &&
            gasTokenSwapData &&
            (gasTokenSwapData.gasTokenPercentage === 0 ||
              gasTokenSwapData.gasTokenPercentage > 80) && (
              <>
                <span data-tip data-for="whyTransferDisabled">
                  <PrimaryButton disabled>Transfer</PrimaryButton>
                </span>
                <CustomTooltip id="whyTransferDisabled">
                  Not enough funds for this transfer
                </CustomTooltip>
              </>
            )}

          {fetchSelectedTokenApprovalStatus === Status.SUCCESS &&
            fetchSelectedTokenApprovalValue === true && (
              <PrimaryButton onClick={onTransferButtonClick}>
                Transfer
              </PrimaryButton>
            )}
        </>
      )}
    </div>
  );
};

export default CallToAction;
