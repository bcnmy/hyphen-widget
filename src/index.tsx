import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'react-loading-skeleton/dist/skeleton.css';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Widget, { WidgetProps } from './widget/Widget';
import AppProviders from './context';
import { Chains, chains } from './config/chains';

declare global {
  interface Window {
    HyphenWidget: HyphenWidget | typeof HyphenWidget;
  }
}

interface HyphenWidgetProps {
  expose: (self: HyphenWidget) => void;
  options: HyphenWidgetOptions & Inputs & InputConfig;
}

export interface HyphenWidgetOptions {
  test?: boolean;
  apiKeys: { [key in Chains]?: string };
  rpcUrls: { [key in Chains]?: string };
  popupMode?: boolean;
  widgetMode?: boolean;
}

interface DefaultInputs {
  defaultSourceChain?: string;
  defaultDestinationChain?: string;
  defaultToken?: string;
  defaultAmount?: string;
  defaultReceiver?: string;
  defaultGaslessMode?: boolean;

  // Never ExternalControlledInputs
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
  setDestinationChain: (newValue: string) => void;
  setToken: (newValue: string) => void;
  setAmount: (newValue: string) => void;
  setReceiver: (newValue: string) => void;
  setGasless: (newValue: boolean) => void;

  // Never DefaultInputs
  defaultSourceChain?: never;
  defaultDestinationChain?: never;
  defaultToken?: never;
  defaultAmount?: never;
  defaultReceiver?: never;
  defaultGaslessMode?: never;
}

// Input format can only fully controlled or fully uncontrolled
export type Inputs = DefaultInputs | ExternalControlledInputs;

export interface InputConfig {
  lockSourceChain?: boolean;
  lockDestinationChain?: boolean;
  lockToken?: boolean;
  lockAmount?: boolean;
  lockReceiver?: boolean;
}
class HyphenWidget extends React.Component<
  HyphenWidgetProps,
  HyphenWidgetOptions & WidgetProps
> {
  constructor(props: HyphenWidgetProps) {
    super(props);
    props.expose(this);
  }

  render() {
    const chainsCopy = [...chains];
    for (const chain of chainsCopy) {
      if (this.props.options.apiKeys[chain.name]) {
        chain.biconomy.apiKey = this.props.options.apiKeys[chain.name]!;
        chain.rpcUrl = this.props.options.rpcUrls[chain.name] || chain.rpcUrl;
      }
    }

    return (
      <>
        <ToastContainer className="font-sans font-semibold" />
        <AppProviders
          test={!!this.props.options.test}
          chains={chainsCopy.filter((e) => e.rpcUrl && e.biconomy.apiKey)}
        >
          <Widget {...this.props.options} />
        </AppProviders>
      </>
    );
  }

  static init(
    ele: HTMLElement,
    options: HyphenWidgetOptions & DefaultInputs & InputConfig
  ) {
    let widget;
    ReactDOM.render(
      <React.StrictMode>
        <HyphenWidget
          expose={(component) => (widget = component)}
          options={options}
        />
      </React.StrictMode>,
      ele
    );
    return widget;
  }
}

if (window) {
  window.HyphenWidget = HyphenWidget;
}

export default Widget;
