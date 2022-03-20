import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "react-loading-skeleton/dist/skeleton.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Widget from "./widget/Widget";
import AppProviders from "./context";

ReactDOM.render(
  <React.StrictMode>
    <ToastContainer className="font-sans font-semibold"/>
    <AppProviders>
      <Widget />
    </AppProviders>
  </React.StrictMode>,
  document.getElementById('hyphen-widget')
); 
