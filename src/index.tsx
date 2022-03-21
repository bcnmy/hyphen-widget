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

interface WidgetProps {
  expose: (self: HyphenWidget) => void;
}

export interface WidgetOptions {
  test?: boolean;
  apiKeys: { [key in Chains]?: string };
  rpcUrls: { [key in Chains]?: string };
  popupMode?: boolean;
  widgetMode?: boolean;
  defaultSourceChain?: string;
  defaultDestinationChain?: string;
  defaultToken?: string;
  defaultAmount?: string;
  editiable?: boolean;
}

class HyphenWidget extends React.Component<WidgetProps> {
  constructor(props: WidgetProps) {
    super(props);
    props.expose(this);
  }

  render() {
    return <Widget />;
  }

  static init(ele: HTMLElement, options: WidgetOptions) {
    let widget;
    for (const chain of chains) {
      if (options.apiKeys[chain.name]) {
        chain.biconomy.apiKey = options.apiKeys[chain.name]!;
        chain.rpcUrl = options.rpcUrls[chain.name] || chain.rpcUrl;
      }
    }
    ReactDOM.render(
      <React.StrictMode>
        <ToastContainer className="font-sans font-semibold" />
        <AppProviders
          options={options}
          chains={chains.filter((e) => e.rpcUrl && e.biconomy.apiKey)}
        >
          <HyphenWidget expose={(component) => (widget = component)} />
        </AppProviders>
      </React.StrictMode>,
      ele
    );
    return widget;
  }
}

window.HyphenWidget = HyphenWidget;

export default Widget;
