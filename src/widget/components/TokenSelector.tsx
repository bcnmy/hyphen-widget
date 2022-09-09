import CustomTooltip from 'components/CustomTooltip';
import Select from 'components/Select';
import { useChains } from 'context/Chains';
import { useToken } from 'context/Token';
import { useTransaction, ValidationErrors } from 'context/Transaction';
import { Status } from 'hooks/useLoading';
import React, { useMemo } from 'react';
import { BiWallet } from 'react-icons/bi';

interface ITokenSelectorProps {
  allowedTokens?: string[];
  disabled?: boolean;
}

const TokenSelector: React.FunctionComponent<ITokenSelectorProps> = ({
  allowedTokens = [],
  disabled,
}) => {
  const {
    tokens,
    compatibleTokensForCurrentChains,
    changeSelectedToken,
    selectedTokenBalance,
    selectedToken,
    getSelectedTokenBalanceStatus,
  } = useToken()!;
  const { transactionAmountValidationErrors } = useTransaction()!;
  const { fromChain } = useChains()!;

  const tokenOptions = useMemo(() => {
    if (!fromChain || !compatibleTokensForCurrentChains) return [];

    // Populate token options depending
    // upon allowedTokens list.
    let compatibleTokens = tokens
      ? Object.keys(tokens).filter((tokenSymbol) => {
          const token = tokens[tokenSymbol];
          return compatibleTokensForCurrentChains.indexOf(token) !== -1;
        })
      : [];

    if (allowedTokens.length > 0) {
      const allowedCompatibleTokens = compatibleTokens.filter((tokenSymbol) =>
        allowedTokens.includes(tokenSymbol)
      );

      if (allowedCompatibleTokens.length > 0) {
        compatibleTokens = allowedCompatibleTokens;
      }
    }

    return tokens
      ? compatibleTokens.map((tokenSymbol) => ({
          id: tokens[tokenSymbol].symbol,
          name: tokens[tokenSymbol].symbol,
          image: tokens[tokenSymbol].image,
        }))
      : [];
  }, [allowedTokens, compatibleTokensForCurrentChains, fromChain, tokens]);

  return (
    <div
      className="tw-hw-relative tw-hw-mt-[15px] tw-hw-flex tw-hw-flex-col tw-hw-justify-between"
      data-tip
      data-for="tokenSelect"
    >
      <Select
        className="md:tw-hw-rounded-l-none"
        options={tokenOptions}
        selected={
          selectedToken &&
          fromChain &&
          tokenOptions.find((opt) => opt.id === selectedToken.symbol)
        }
        setSelected={(opt) => {
          fromChain &&
            changeSelectedToken(
              tokens
                ? Object.keys(tokens).find(
                    (tokenSymbol) => tokenSymbol === opt.id
                  )
                : ''
            );
        }}
        label={''}
        disabled={disabled}
      />
      <div
        className={`tw-hw-absolute tw-hw-top-[-15px] tw-hw-right-3 tw-hw-inline-flex tw-hw-items-center tw-hw-text-xxs tw-hw-font-bold tw-hw-uppercase tw-hw-text-hyphen-gray-300 
        ${
          transactionAmountValidationErrors.includes(
            ValidationErrors.INADEQUATE_BALANCE
          ) && 'tw-hw-text-red-600'
        }
      `}
      >
        <BiWallet className="tw-hw-mr-1 tw-hw-h-2.5 tw-hw-w-2.5" />
        {getSelectedTokenBalanceStatus &&
        getSelectedTokenBalanceStatus === Status.SUCCESS &&
        selectedTokenBalance?.displayBalance ? (
          <span className="tw-hw-transition-colors">
            {selectedTokenBalance?.displayBalance || 0}
          </span>
        ) : (
          '...'
        )}
      </div>
      {disabled && (
        <CustomTooltip id="tokenSelect">
          <span>Select source & destination chains</span>
        </CustomTooltip>
      )}
    </div>
  );
};

export default TokenSelector;
