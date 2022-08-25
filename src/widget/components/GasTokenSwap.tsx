import CustomTooltip from 'components/CustomTooltip';
import { Toggle } from 'components/Toggle';
import { useChains } from 'context/Chains';
import { useToken } from 'context/Token';
import { useTransaction } from 'context/Transaction';
import { BigNumber, ethers } from 'ethers';

function GasTokenSwap() {
  const { toChain } = useChains()!;
  const { selectedToken, tokens } = useToken()!;
  const {
    enableGasTokenSwap,
    gasTokenSwapData,
    setEnableGasTokenSwap,
    transferAmount,
    removeGasTokenSwapData,
  } = useTransaction()!;

  // Destination chain & token should be selected.
  const prerequisites = toChain && selectedToken;

  // Check if gas token swap is supported.
  const isGasTokenSwapSupported =
    prerequisites &&
    selectedToken[toChain.chainId] &&
    selectedToken[toChain.chainId].allowGasSwap;

  // Disable when:
  // gas token swap is not not supported
  // or if transfer amount is null.
  const disableGasTokenSwap = !isGasTokenSwapSupported || !transferAmount;

  // Set a message for the tooltip.
  let disableGasTokenSwapMsg;
  if (!prerequisites) {
    disableGasTokenSwapMsg = 'Select destination chain & token';
  } else if (!isGasTokenSwapSupported) {
    disableGasTokenSwapMsg = 'Gas token swap is not supported';
  } else if (!transferAmount) {
    disableGasTokenSwapMsg = 'Enter an amount to transfer';
  } else {
    disableGasTokenSwapMsg = '';
  }

  const { gasTokenPercentage } = gasTokenSwapData ?? {};
  const gasTokenSymbol =
    tokens && toChain
      ? Object.keys(tokens).find((tokenSymbol: string) => {
          const token = tokens[tokenSymbol];
          return token && token[toChain.chainId]
            ? token[toChain.chainId].address ===
                toChain?.wrappedNativeTokenAddress
            : undefined;
        })
      : undefined;

  let gasTokenMsg;
  if (
    gasTokenPercentage !== undefined &&
    (gasTokenPercentage === 0 || gasTokenPercentage > 80)
  ) {
    gasTokenMsg = `Not enough funds to get ${ethers.utils.formatUnits(
      BigNumber.from(toChain?.gasTokenSwap.gasTokenAmount),
      toChain?.nativeDecimal
    )} ${gasTokenSymbol} on ${toChain?.name}`;
  } else if (
    gasTokenPercentage !== undefined &&
    gasTokenPercentage > 0 &&
    gasTokenPercentage <= 80
  ) {
    gasTokenMsg = `Swapping ~${gasTokenSwapData.gasTokenPercentage.toFixed(
      3
    )}% of ${transferAmount} ${
      selectedToken?.symbol
    } for ${ethers.utils.formatUnits(
      BigNumber.from(toChain?.gasTokenSwap.gasTokenAmount),
      toChain?.nativeDecimal
    )} ${gasTokenSymbol} on ${toChain?.name}`;
  }

  return (
    <div className="flex items-center">
      <div
        className={
          disableGasTokenSwap
            ? 'flex cursor-not-allowed items-center opacity-50'
            : 'flex items-center'
        }
        data-tip
        data-for="whyGasTokenDisabled"
      >
        <span className="mr-2 text-base font-semibold text-hyphen-purple">
          Get gas token on destination
        </span>
        <Toggle
          bgColor="#615CCD"
          label="Get gas token on destination"
          enabled={enableGasTokenSwap}
          disabled={disableGasTokenSwap}
          onToggle={() => {
            // Remove any existing data.
            if (enableGasTokenSwap) {
              removeGasTokenSwapData();
            }
            setEnableGasTokenSwap(!enableGasTokenSwap);
          }}
          variant="large"
        />
        <a
          href="/"
          className="ml-2 hidden font-sans text-xs text-hyphen-gray-400 underline md:ml-2 md:block"
        >
          How does it work?
        </a>
      </div>
      {disableGasTokenSwap ? (
        <CustomTooltip id="whyGasTokenDisabled">
          <span>{disableGasTokenSwapMsg}</span>
        </CustomTooltip>
      ) : null}
      {enableGasTokenSwap &&
      gasTokenSwapData &&
      gasTokenSwapData?.gasTokenPercentage !== undefined ? (
        <CustomTooltip id="gasTokenMsg">{gasTokenMsg}</CustomTooltip>
      ) : null}
    </div>
  );
}

export default GasTokenSwap;
