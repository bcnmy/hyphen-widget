# Hyphen Widget

Getting started with the Hyphen widget is quite easy, no need to worry about building your own UI. Having seamless bridging inside your dApp has never been easier!

## Installation

```shell
npm install @biconomy/hyphen-widget

or

yarn add @biconomy/hyphen-widget
```

## Importing & Instantiation

- To use the widget import the HyphenWidget component and initialize it in your JavaScript file by passing a "tag" value in its configuration. This is the only mandatory parameter, other parameters are optional.
- Add an element in your HTML with an appropriate ID which will render the widget.

```javascript
import * as HyphenWidget from "@biconomy/hyphen-widget";
import "@biconomy/hyphen-widget/dist/index.css";

const hyphenWidget = HyphenWidget.default.init(
  document.getElementById("widget"),
  {
    // unique identifier for your application (should ideally contain your dApp name),
    // this is a required field.
    tag: string,
  }
);
```

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite App</title>
  </head>
  <body>
    <div class="widget-container">
      <div id="widget"></div>
    </div>
    <script type="module" src="/main.js"></script>
  </body>
</html>
```

### Using the Widget in React

```typescript
import { useState, useEffect } from "react";
import * as HyphenWidget from "@biconomy/hyphen-widget";
import "@biconomy/hyphen-widget/dist/index.css";

function App() {
  const [hyphenWidget, setHyphenWidget] = useState();

  useEffect(() => {
    const widget = HyphenWidget.default.init(
      document.getElementById("widget"),
      {
        tag: "expecto-patronum",
        showWidget: true,
        showCloseButton: true,
      }
    );

    if (widget) {
      setHyphenWidget(widget);
    }
  }, []);

  function handleOpen() {
    hyphenWidget.open();
  }

  function handleClose() {
    hyphenWidget.close();
  }

  return <div className="App">
    <button onClick={handleOpen}>Open Widget</button>
    <button onClick={handleClose}>Close Widget</button>

    <div id="widget"></div>
  </div>;
}

export default App;
```

## Optional configuration

The following additional configuration options can be passed while initializing the widget:

```typescript
{
  env: string, // can be test, staging or production. Default: "staging"
  showWidget: boolean, // should the widget be shown by default or not. Default: false
  showCloseButton: boolean, // should the widget have a close button to close it. Default: false
  showChangeAddress: boolean, // should the widget allow ability to change receiver address. Default: true
  // API keys for using Gasless.
  apiKeys: {
    Ethereum: string,
    Polygon: string,
    Avalanche: string,
  },
  // Custom RPC URLs for the supported networks.
  rpcUrls: {
    Ethereum: string,
    Polygon: string,
    Avalanche: string,
  },
  // NOTE: following 2 callback emit when tx is *sent*, you should check the status by yourself
  onDeposit: (e) => console.log("Deposit " + e), // emit when depost tx is sent
  onExit: (e) => console.log("Exit " + e), // emit when exit tx (receiver will receive tokens) is sent
  /*
      input: {
          sourceChain?: string;
          destinationChain?: string;
          token?: string;
          amount?: string;
          receiver?: string;
          gasless: boolean;
      }
  */
  onChange: (input) => console.log("Input " + JSON.stringify(input)),
}
```

Note: For using Gasless obtain Biconomy api keys from [Biconomy](https://dashboard.biconomy.io/) and pass those during initialization using `apiKeys` object. Similarly for passing custom RPC URLs obtain RPC endpoints from providers like [Infura](https://infura.io/) or [Alchemy](https://www.alchemy.com/) and pass them using `rpcUrls` object.

For testnets the initialization would look something like this:

```javascript
import * as HyphenWidget from "@biconomy/hyphen-widget";
import "@biconomy/hyphen-widget/dist/index.css";

const hyphenWidget = HyphenWidget.default.init(document.getElementById("widget"), {
  tag: "my-awesome-dapp",
  env: "test",
  // Other options.
  ...
});
```

## Methods

### open

Use the `open` method to open the modal:

```typescript
import * as HyphenWidget from "@biconomy/hyphen-widget";
import "@biconomy/hyphen-widget/dist/index.css";

const hyphenWidget = HyphenWidget.default.init(
  document.getElementById("widget"),
  {
    tag: "my-awesome-dapp",
  }
);

hyphenWidget.open();
```

### close

Use the `close` method to close the modal:

```typescript
import * as HyphenWidget from "@biconomy/hyphen-widget";
import "@biconomy/hyphen-widget/dist/index.css";

const hyphenWidget = HyphenWidget.default.init(
  document.getElementById("widget"),
  {
    tag: "my-awesome-dapp",
  }
);

hyphenWidget.close();
```

## Demo

You can check out the demo repository [here](https://github.com/bcnmy/hyphen-widget-demo). The hosted versions of the demo can be checked over here: [mainnet](https://hyphen-widget-demo.biconomy.io/) and [testnet](https://hyphen-widget-demo-test.biconomy.io/).

We also have a video going through the widget's integration:

https://www.youtube.com/watch?v=1ErNhH6TKj0

