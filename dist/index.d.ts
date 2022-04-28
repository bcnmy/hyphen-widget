import React from "react";
import "./index.css";
import "react-loading-skeleton/dist/skeleton.css";
import "react-toastify/dist/ReactToastify.css";
import { Chains } from "./config/chains";
declare global {
    interface Window {
        HyphenWidget: HyphenWidget | typeof HyphenWidget;
    }
}
interface HyphenWidgetProps {
    expose: (self: HyphenWidget) => void;
    options: HyphenWidgetOptions & Inputs & InputConfig;
    skipToastContainer?: boolean;
}
export interface HyphenWidgetOptions {
    test?: boolean;
    apiKeys: {
        [key in Chains]?: string;
    };
    rpcUrls: {
        [key in Chains]?: string;
    };
    popupMode?: boolean;
    widgetMode?: boolean;
    onDeposit?: (hash: string) => any;
    onExit?: (hash: string) => any;
    onChange?: (obj: {
        sourceChain?: string;
        destinationChain?: string;
        token?: string;
        amount?: string;
        receiver?: string;
        gasless: boolean;
    }) => any;
}
interface DefaultInputs {
    defaultSourceChain?: string;
    defaultDestinationChain?: string;
    defaultToken?: string;
    defaultAmount?: string;
    defaultReceiver?: string;
    defaultGaslessMode?: boolean;
    sourceChain?: never;
    destinationChain?: never;
    token?: never;
    amount?: never;
    receiver?: never;
    gasless?: never;
    setSourceChain: never;
    setDestinationChain: never;
    setToken: never;
    setAmount: never;
    setReceiver: never;
    setGasless: never;
}
interface ExternalControlledInputs {
    sourceChain?: string;
    destinationChain?: string;
    token?: string;
    amount?: string;
    receiver?: string;
    gasless?: boolean;
    setSourceChain: (newValue: string) => void;
    setDestinationChain: (newValue: string | undefined) => void;
    setToken: (newValue: string) => void;
    setAmount: (newValue: string) => void;
    setReceiver: (newValue: string) => void;
    setGasless: (newValue: boolean) => void;
    defaultSourceChain?: never;
    defaultDestinationChain?: never;
    defaultToken?: never;
    defaultAmount?: never;
    defaultReceiver?: never;
    defaultGaslessMode?: never;
}
export declare type Inputs = DefaultInputs | ExternalControlledInputs;
export interface InputConfig {
    lockSourceChain?: boolean;
    lockDestinationChain?: boolean;
    lockToken?: boolean;
    lockAmount?: boolean;
    lockReceiver?: boolean;
}
declare class HyphenWidget extends React.Component<HyphenWidgetProps, HyphenWidgetOptions & Inputs & InputConfig> {
    private element?;
    constructor(props: HyphenWidgetProps);
    render(): JSX.Element;
    setElement(element: Element): void;
    destroy(): void;
    static init(ele: HTMLElement, options: HyphenWidgetOptions & DefaultInputs & InputConfig): undefined;
}
export default HyphenWidget;
//# sourceMappingURL=index.d.ts.map