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
    transferAmount,
    transactionAmountValidationErrors,
    enableGasTokenSwap,
    gasTokenSwapData,
    fetchTransactionFeeStatus,
  } = useTransaction()!;
  const { isBiconomyEnabled } = useBiconomy()!;

  if (!isLoggedIn) {
    return (
      <div className="tw-hw-grid tw-hw-grid-cols-1">
        <PrimaryButton onClick={() => connect()}>Connect Wallet</PrimaryButton>
      </div>
    );
  }

  if (!isBiconomyEnabled && fromChain?.chainId !== currentChainId) {
    return (
      <div className="tw-hw-grid tw-hw-grid-cols-1">
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
      <div className="tw-hw-grid tw-hw-grid-cols-1">
        <PrimaryButton disabled>Invalid receiver address</PrimaryButton>
      </div>
    );
  }

  return (
    <div className="tw-hw-grid tw-hw-grid-cols-1">
      {fetchSelectedTokenApprovalStatus === Status.IDLE ||
      transactionAmountValidationErrors.length > 0 ||
      fetchSelectedTokenApprovalError ? (
        <>
          <PrimaryButton disabled>
            {!transferAmount
              ? 'Enter amount'
              : fetchSelectedTokenApprovalError &&
                transactionAmountValidationErrors.length === 0
              ? 'Error in fetching approval'
              : transactionAmountValidationErrors.length > 0
              ? 'Please check the amount'
              : ''}
          </PrimaryButton>
        </>
      ) : (
        <>
          {fetchSelectedTokenApprovalStatus === Status.PENDING && (
            <PrimaryButton disabled>Checking approval...</PrimaryButton>
          )}

          {fetchSelectedTokenApprovalStatus === Status.SUCCESS &&
            fetchSelectedTokenApprovalValue === false && (
              <PrimaryButton onClick={onApproveButtonClick}>
                Approve
              </PrimaryButton>
            )}

          {fetchSelectedTokenApprovalStatus === Status.SUCCESS &&
            fetchSelectedTokenApprovalValue === true &&
            enableGasTokenSwap &&
            gasTokenSwapData &&
            (gasTokenSwapData.gasTokenPercentage === 0 ||
              gasTokenSwapData.gasTokenPercentage > 80) && (
              <PrimaryButton disabled>
                Not enough funds for this transfer
              </PrimaryButton>
            )}

          {fetchSelectedTokenApprovalStatus === Status.SUCCESS &&
            fetchSelectedTokenApprovalValue === true && (
              <PrimaryButton
                onClick={onTransferButtonClick}
                disabled={fetchTransactionFeeStatus === Status.PENDING}
              >
                {fetchTransactionFeeStatus === Status.PENDING
                  ? 'Calculating total fees'
                  : 'Transfer'}
              </PrimaryButton>
            )}
        </>
      )}
    </div>
  );
};

export default CallToAction;
