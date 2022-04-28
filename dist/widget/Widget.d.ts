import React from "react";
import { HyphenWidgetOptions, InputConfig, Inputs } from "../";
export interface WidgetProps {
    sourceChain: string | undefined;
    destinationChain: string | undefined;
    token: string;
    amount: string;
    receiver: string;
    gasless: boolean;
    lockSourceChain?: boolean;
    lockDestinationChain?: boolean;
    lockToken?: boolean;
    lockAmount?: boolean;
    lockReceiver?: boolean;
}
interface WidgetSetFunctions {
    setSourceChain: (newValue: string) => void;
    setDestinationChain: (newValue: string | undefined) => void;
    setToken: (newValue: string) => void;
    setAmount: (newValue: string) => void;
    setReceiver: (newValue: string) => void;
    setGasless: (newValue: boolean) => void;
}
declare const Widget: React.FC<HyphenWidgetOptions & WidgetSetFunctions & Inputs & InputConfig>;
export default Widget;
//# sourceMappingURL=Widget.d.ts.map