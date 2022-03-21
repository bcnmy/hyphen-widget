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
  onSourceChainChange?: never;
  onDestinationChainChange?: never;
  onTokenChange?: never;
  onAmountChange?: never;
  onReceiverChange?: never;
  onGaslessChange?: never;
}

interface ExternalControlledInputs {
  sourceChain?: string;
  destinationChain?: string;
  token?: string;
  amount?: string;
  receiver?: string;
  gasless?: boolean;
  onSourceChainChange?: (prev: string, to: string) => any;
  onDestinationChainChange?: (prev: string, to: string) => any;
  onTokenChange?: (prev: string, to: string) => any;
  onAmountChange?: (prev: string, to: string) => any;
  onReceiverChange?: (prev: string, to: string) => any;
  onGaslessChange?: (prev: boolean, to: boolean) => any;

  // Never DefaultInputs
  defaultSourceChain?: never;
  defaultDestinationChain?: never;
  defaultToken?: never;
  defaultAmount?: never;
  defaultReceiver?: never;
  defaultGaslessMode?: never;
}

// Input format can only fully controlled or fully uncontrolled
type Inputs = DefaultInputs | ExternalControlledInputs;

interface InputConfig {
  lockSourceChain?: boolean;
  lockDestinationChain?: boolean;
  lockToken?: boolean;
  lockAmount?: boolean;
  lockReceiver?: boolean;
}
class HyphenWidget extends React.Component<
  HyphenWidgetProps,
  HyphenWidgetOptions & ExternalControlledInputs & InputConfig
> {
  constructor(props: HyphenWidgetProps) {
    super(props);
    props.expose(this);

    let isDefaultMode = !(
      this.props.options.sourceChain ||
      this.props.options.destinationChain ||
      this.props.options.token ||
      this.props.options.amount ||
      this.props.options.receiver ||
      this.props.options.gasless ||
      this.props.options.onSourceChainChange ||
      this.props.options.onDestinationChainChange ||
      this.props.options.onTokenChange ||
      this.props.options.onAmountChange ||
      this.props.options.onReceiverChange ||
      this.props.options.onGaslessChange
    );

    this.state = {
      test: props.options.test,
      apiKeys: props.options.apiKeys,
      rpcUrls: props.options.rpcUrls,
      popupMode: props.options.popupMode,
      widgetMode: props.options.widgetMode,
      lockSourceChain: props.options.lockSourceChain,
      lockDestinationChain: props.options.lockDestinationChain,
      lockToken: props.options.lockToken,
      lockAmount: props.options.lockAmount,
      lockReceiver: props.options.lockReceiver,
      sourceChain:
        props.options.defaultSourceChain ||
        props.options.sourceChain ||
        'Mumbai',
      destinationChain:
        props.options.defaultDestinationChain ||
        props.options.destinationChain ||
        'Goerli',
      token: props.options.defaultToken || props.options.token || 'ETH',
      amount: props.options.defaultAmount || props.options.amount || '',
      receiver: props.options.defaultReceiver || props.options.receiver || '',
      gasless:
        props.options.defaultGaslessMode || props.options.gasless || false,
      onSourceChainChange: isDefaultMode
        ? (_, newValue) =>
            this.setState((prev) => ({
              ...prev,
              sourceChain: newValue,
            }))
        : props.options.onSourceChainChange,
      onDestinationChainChange: isDefaultMode
        ? (_, newValue) =>
            this.setState((prev) => ({
              ...prev,
              destinationChain: newValue,
            }))
        : props.options.onDestinationChainChange,
      onTokenChange: isDefaultMode
        ? (_, newValue) =>
            this.setState((prev) => ({
              ...prev,
              token: newValue,
            }))
        : props.options.onTokenChange,
      onAmountChange: isDefaultMode
        ? (_, newValue) =>
            this.setState((prev) => ({
              ...prev,
              amount: newValue,
            }))
        : props.options.onAmountChange,
      onReceiverChange: isDefaultMode
        ? (_, newValue) =>
            this.setState((prev) => ({
              ...prev,
              receiver: newValue,
            }))
        : props.options.onReceiverChange,
      onGaslessChange: isDefaultMode
        ? (_, newValue) =>
            this.setState((prev) => ({
              ...prev,
              gasless: newValue,
            }))
        : props.options.onGaslessChange,
    };
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
        <ToastContainer className="font-sans font-semibold" />
        <AppProviders
          options={this.state}
          chains={chainsCopy.filter((e) => e.rpcUrl && e.biconomy.apiKey)}
        >
          <Widget {...this.state} />
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

window.HyphenWidget = HyphenWidget;

export default Widget;
