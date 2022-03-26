import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'react-loading-skeleton/dist/skeleton.css';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Widget from './widget/Widget';
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
  skipToastContainer?: boolean;
}

export interface HyphenWidgetOptions {
  test?: boolean;
  apiKeys: { [key in Chains]?: string };
  rpcUrls: { [key in Chains]?: string };
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
  setDestinationChain: (newValue: string | undefined) => void;
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
  HyphenWidgetOptions & Inputs & InputConfig
> {
  private element?: Element;

  constructor(props: HyphenWidgetProps) {
    super(props);
    props.expose(this);
    this.state = props.options;
  }

  render() {
    const chainsCopy = [...chains];
    for (const chain of chainsCopy) {
      if (this.state.apiKeys[chain.name]) {
        chain.biconomy.apiKey = this.state.apiKeys[chain.name]!;
        chain.rpcUrl = this.state.rpcUrls[chain.name] || chain.rpcUrl;
      }
    }

    return (
      <>
        {this.props.skipToastContainer ? null : (
          <ToastContainer className="font-sans font-semibold" />
        )}
        <AppProviders
          test={!!this.state.test}
          chains={chainsCopy.filter((e) => e.rpcUrl && e.biconomy.apiKey)}
        >
          <Widget {...this.state} />
        </AppProviders>
      </>
    );
  }

  setElement(element: Element) {
    if (this.element) throw new Error('Cannot override element ref');
    this.element = element;
  }

  destroy() {
    if (!this.element) throw new Error('Element ref not found');
    ReactDOM.unmountComponentAtNode(this.element);
  }

  static init(
    ele: HTMLElement,
    options: HyphenWidgetOptions & DefaultInputs & InputConfig
  ) {
    let widget;
    ReactDOM.render(
      <React.StrictMode>
        <HyphenWidget
          expose={(component) => {
            widget = component;
            widget.setElement(ele);
          }}
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
