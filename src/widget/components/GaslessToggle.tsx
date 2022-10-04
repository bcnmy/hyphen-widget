import { useBiconomy } from 'context/Biconomy';
import CustomTooltip from 'components/CustomTooltip';
import { Toggle } from 'components/Toggle';
import { useChains } from 'context/Chains';

function GaslessToggle() {
  const { isBiconomyAllowed, isBiconomyEnabled, setIsBiconomyToggledOn } =
    useBiconomy()!;
  const { fromChain } = useChains()!;

  return (
    <div className="tw-hw-mb-2 tw-hw-flex tw-hw-items-center tw-hw-justify-end">
      <div className="tw-hw-flex tw-hw-items-center">
        <div
          className={
            !isBiconomyAllowed
              ? 'tw-hw-flex tw-hw-cursor-not-allowed tw-hw-items-center tw-hw-opacity-50'
              : 'tw-hw-flex tw-hw-cursor-pointer tw-hw-items-center'
          }
          data-tip
          data-for="gaslessToggleTooltip"
          onClick={() => setIsBiconomyToggledOn(!isBiconomyEnabled)}
        >
          <Toggle
            bgColor="#CCBA5C"
            label="Go Gasless"
            enabled={isBiconomyEnabled}
            disabled={!isBiconomyAllowed}
            onToggle={(enabled) => setIsBiconomyToggledOn(enabled)}
          />
          <span className="tw-hw-ml-2 tw-hw-text-xxxs tw-hw-font-bold tw-hw-uppercase tw-hw-text-hyphen-gray-400 md:tw-hw-text-xxs">
            Gasless
          </span>
        </div>
      </div>
      {!isBiconomyAllowed ? (
        <CustomTooltip id="gaslessToggleTooltip">
          <span>Disabled for selected chain</span>
        </CustomTooltip>
      ) : (
        <CustomTooltip id="gaslessToggleTooltip">
          <span>Gasless transactions on {fromChain?.name} ✨</span>
        </CustomTooltip>
      )}
    </div>
  );
}

export default GaslessToggle;
