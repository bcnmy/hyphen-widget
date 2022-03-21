import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'react-loading-skeleton/dist/skeleton.css';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Widget from './widget/Widget';
import AppProviders from './context';

declare global {
  interface Window {
    HyphenWidget: HyphenWidget | typeof HyphenWidget;
  }
}

interface WidgetProps {
  expose: (self: HyphenWidget) => void;
}
interface WidgetState {}
class HyphenWidget extends React.Component<WidgetProps, WidgetState> {
  constructor(props: WidgetProps) {
    super(props);
    props.expose(this);
  }

  render() {
    return <Widget />;
  }

  static init(ele: HTMLElement) {
    let widget;
    ReactDOM.render(
      <React.StrictMode>
        <ToastContainer className="font-sans font-semibold" />
        <AppProviders>
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
