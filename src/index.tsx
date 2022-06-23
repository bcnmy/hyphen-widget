import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "react-loading-skeleton/dist/skeleton.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Widget from "./widget/Widget";
import AppProviders from "./context";

declare global {
  interface Window {
    HyphenWidget: HyphenWidget | typeof HyphenWidget;
  }
}

interface HyphenWidgetProps {
  expose: (self: HyphenWidget) => void;
  open: (open: any) => void;
  close: (close: any) => void;
  options: HyphenWidgetOptions;
  skipToastContainer?: boolean;
}

export interface HyphenWidgetOptions {
  tag: string;
  env?: string;
  showWidget?: boolean;
  showCloseButton?: boolean;
  showChangeAddress?: boolean;
  allowedSourceChains?: number[];
  allowedDestinationChains?: number[];
  allowedTokens?: string[];
  defaultSourceChain?: number;
  defaultDestinationChain?: number;
  defaultToken?: string;
  apiKeys?: { [key: string]: string };
  rpcUrls?: { [key: string]: string };
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

class HyphenWidget extends React.Component<
  HyphenWidgetProps,
  HyphenWidgetOptions
> {
  private element?: Element;

  constructor(props: HyphenWidgetProps) {
    super(props);
    props.expose && props.expose(this);
    props.open(this.open);
    props.close(this.close);
    this.state = {
      ...props.options,
      showWidget: props.options.showWidget ?? false,
      showCloseButton: props.options.showCloseButton ?? false,
      showChangeAddress: props.options.showChangeAddress ?? true,
    };
  }

  open() {
    console.log("opening widget!");
    this.setState((prevState) => ({
      ...prevState,
      showWidget: true,
    }));
  }

  close() {
    console.log("closing widget!");
    this.setState((prevState) => ({
      ...prevState,
      showWidget: false,
    }));
  }

  render() {
    const showWidget = this.state.showWidget;

    return showWidget ? (
      <>
        {this.props.skipToastContainer ? null : (
          <ToastContainer className="font-sans font-semibold" />
        )}
        <AppProviders options={this.props.options}>
          <Widget {...this.state} closeWidget={() => this.close()} />
        </AppProviders>
      </>
    ) : null;
  }

  setElement(element: Element) {
    if (this.element) throw new Error("Cannot override element ref");
    this.element = element;
  }

  destroy() {
    if (!this.element) throw new Error("Element ref not found");
    ReactDOM.unmountComponentAtNode(this.element);
  }

  static init(ele: HTMLElement, options: HyphenWidgetOptions) {
    let widget: any;

    if (!options.tag) {
      throw new Error(
        "Tag is a mandatory field, please specify it to use the widget!"
      );
    }

    ReactDOM.render(
      <React.StrictMode>
        <HyphenWidget
          expose={(component) => {
            widget = component;
            widget.setElement(ele);
          }}
          open={(open) => {
            widget.open = open;
          }}
          close={(close) => {
            widget.close = close;
          }}
          options={options}
        />
      </React.StrictMode>,
      ele
    );
    return widget;
  }
}

export default HyphenWidget;
