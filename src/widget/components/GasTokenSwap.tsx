import CustomTooltip from 'components/CustomTooltip';
import { Toggle } from 'components/Toggle';
import { useChains } from 'context/Chains';
import { useToken } from 'context/Token';
import { useTransaction } from 'context/Transaction';
import { BigNumber, ethers } from 'ethers';
import { HiInformationCircle } from 'react-icons/hi';

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

  let gasTokenMsg;
  if (
    gasTokenPercentage !== undefined &&
    (gasTokenPercentage === 0 || gasTokenPercentage > 80)
  ) {
    gasTokenMsg = `Not enough funds to get ${ethers.utils.formatUnits(
      BigNumber.from(toChain?.gasTokenSwap.gasTokenAmount),
      toChain?.nativeDecimal
    )} ${toChain?.currency} on ${toChain?.name}`;
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
    )} ${toChain?.currency} on ${toChain?.name}`;
  }

  return (
    <div className="rounded-lg bg-hyphen-purple bg-opacity-[0.05] px-4 py-2 hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75">
      <div className="flex items-center">
        <HiInformationCircle
          data-tip
          data-for="gasToken"
          className="mr-2 text-gray-500"
        />
        <div
          className={
            disableGasTokenSwap
              ? 'flex cursor-not-allowed items-center opacity-50'
              : 'flex items-center'
          }
          data-tip
          data-for="whyGasTokenDisabled"
        >
          <span className="mr-2 text-xxs font-semibold uppercase text-hyphen-gray-400">
            Get gas token on destination?
          </span>
          <Toggle
            label="Gasless Mode"
            enabled={enableGasTokenSwap}
            disabled={disableGasTokenSwap}
            onToggle={() => {
              // Remove any existing data.
              if (enableGasTokenSwap) {
                removeGasTokenSwapData();
              }
              setEnableGasTokenSwap(!enableGasTokenSwap);
            }}
          />
        </div>
        {disableGasTokenSwap ? (
          <CustomTooltip id="whyGasTokenDisabled">
            <span>{disableGasTokenSwapMsg}</span>
          </CustomTooltip>
        ) : null}
        <CustomTooltip id="gasToken">
          <span>
            A small amount of transferred token will be swapped for gas.
          </span>
        </CustomTooltip>
      </div>
      {enableGasTokenSwap &&
      gasTokenSwapData &&
      gasTokenSwapData?.gasTokenPercentage !== undefined ? (
        <span className="ml-6 text-xxs font-semibold text-hyphen-gray-400">
          {gasTokenMsg}
        </span>
      ) : null}
    </div>
  );
}

export default GasTokenSwap;
