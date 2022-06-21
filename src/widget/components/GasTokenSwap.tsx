import CustomTooltip from "components/CustomTooltip";
import { Toggle } from "components/Toggle";
import { useChains } from "context/Chains";
import { useTransaction } from "context/Transaction";
import { HiInformationCircle } from "react-icons/hi";

function GasTokenSwap() {
  const { toChain } = useChains()!;
  const {
    enableGasTokenSwap,
    setEnableGasTokenSwap,
    transferAmountInputValue,
  } = useTransaction()!;

  const showGasTokenSwap =
    toChain?.isGasTokenSupported && transferAmountInputValue;

  return showGasTokenSwap ? (
    <div className="flex items-center px-4 py-2 bg-hyphen-purple bg-opacity-[0.05] rounded-lg hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75">
      <HiInformationCircle
        data-tip
        data-for="gasToken"
        className="mr-2 text-gray-500"
      />
      <span className="mr-2 text-xxs font-semibold text-hyphen-gray-400 uppercase">
        Get gas token on destination?
      </span>
      <Toggle
        label="Gasless Mode"
        enabled={enableGasTokenSwap}
        onToggle={() => setEnableGasTokenSwap(!enableGasTokenSwap)}
      />
      <CustomTooltip id="gasToken">
        <span>Gas token tooltip!</span>
      </CustomTooltip>
    </div>
  ) : null;
}

export default GasTokenSwap;
