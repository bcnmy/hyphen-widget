import CustomTooltip from "components/CustomTooltip";
import { Toggle } from "components/Toggle";
import { useChains } from "context/Chains";
import { useToken } from "context/Token";
import { useTransaction } from "context/Transaction";
import { HiInformationCircle } from "react-icons/hi";

function GasTokenSwap() {
  const { toChain } = useChains()!;
  const { selectedToken } = useToken()!;
  const {
    enableGasTokenSwap,
    gasTokenSwapData,
    setEnableGasTokenSwap,
    transferAmount,
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
    disableGasTokenSwapMsg = "Select destination chain & token";
  } else if (!isGasTokenSwapSupported) {
    disableGasTokenSwapMsg = "Gas token swap is not supported";
  } else if (!transferAmount) {
    disableGasTokenSwapMsg = "Enter an amount to transfer";
  } else {
    disableGasTokenSwapMsg = "";
  }

  console.log(gasTokenSwapData);

  return (
    <div className="px-4 py-2 bg-hyphen-purple bg-opacity-[0.05] rounded-lg hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75">
      <div className="flex items-center">
        <HiInformationCircle
          data-tip
          data-for="gasToken"
          className="mr-2 text-gray-500"
        />
        <div
          className={
            disableGasTokenSwap
              ? "flex items-center cursor-not-allowed opacity-50"
              : "flex items-center"
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
            onToggle={() => setEnableGasTokenSwap(!enableGasTokenSwap)}
          />
        </div>
        {disableGasTokenSwap ? (
          <CustomTooltip id="whyGasTokenDisabled">
            <span>{disableGasTokenSwapMsg}</span>
          </CustomTooltip>
        ) : null}
        <CustomTooltip id="gasToken">
          <span>Gas token tooltip!</span>
        </CustomTooltip>
      </div>
      {gasTokenSwapData && gasTokenSwapData?.gasTokenPercentage ? (
        <span className="text-xxs font-semibold text-hyphen-gray-400 ml-6">
          You will get {gasTokenSwapData.gasTokenPercentage.toFixed(3)}% of gas
          tokens
        </span>
      ) : null}
    </div>
  );
}

export default GasTokenSwap;
