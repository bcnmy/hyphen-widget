import { HiInformationCircle } from 'react-icons/hi';
import { useBiconomy } from 'context/Biconomy';
import CustomTooltip from 'components/CustomTooltip';
import { Toggle } from 'components/Toggle';
import { useChains } from 'context/Chains';

function GaslessToggle() {
  const { isBiconomyAllowed, isBiconomyEnabled, setIsBiconomyToggledOn } =
    useBiconomy()!;
  const { toChain } = useChains()!;

  return (
    <div className="mb-2 flex items-center justify-end">
      <div className="flex items-center">
        <div
          className={
            !isBiconomyAllowed
              ? 'flex cursor-not-allowed items-center opacity-50'
              : 'flex cursor-pointer items-center'
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
          <span className="ml-2 text-xxxs font-bold uppercase text-hyphen-yellow-100 xl:text-xxs">
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
          <span>Gasless transactions on ${toChain?.name} ✨</span>
        </CustomTooltip>
      )}
    </div>
  );
}

export default GaslessToggle;
