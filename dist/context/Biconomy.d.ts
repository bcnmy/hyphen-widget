/// <reference types="react" />
interface IBiconomyContext {
    biconomy: undefined | any;
    isBiconomyReady: boolean;
    isBiconomyEnabled: boolean;
    isBiconomyToggledOn: boolean;
    setIsBiconomyToggledOn: (isOn: boolean) => void;
    isBiconomyAllowed: boolean;
}
declare const BiconomyProvider: React.FC;
declare const useBiconomy: () => IBiconomyContext | null;
export { BiconomyProvider, useBiconomy };
//# sourceMappingURL=Biconomy.d.ts.map