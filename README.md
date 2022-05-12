# Hyphen Widget

Getting started with the Hyphen widget is quite easy, no need to worry about building your own UI. Having seamless bridging inside your dApp has never been easier!

### Installation

```shell
npm install @biconomy/hyphen-widget

or

yarn add @biconomy/hyphen-widget
```

### Importing & Instantiation

- Obtain Biconomy api keys from [Biconomy](https://dashboard.biconomy.io/)
- Obtain RPC endpoints from providers like [Infura](https://infura.io/) or [Alchemy](https://www.alchemy.com/)
- To use the widget in any html page, create an element and use HyphenWidget.default.init
- Add an element in your HTML with an appropriate ID which will render the widget.

```javascript
import * as HyphenWidget from "@biconomy/hyphen-widget/dist";
import "@biconomy/hyphen-widget/dist/index.css";

const hyphenWidget = HyphenWidget.default.init(document.getElementById("widget"), {
  // unique identifier for your application (should ideally contain your dApp name),
  // this is a required field.
  tag: string,
});
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

## Optional configuration

The following additional configuration options can be passed while initializing the widget:

```typescript
{
  env: string, // can be test, staging or production. Default: "staging"
  showWidget: boolean, // should the widget be shown by default or not. Default: false
  showCloseButton: boolean, // should the widget have a close button to close it. Default: false
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

For testnets the initialization would look somewhat like this:

```javascript
import * as HyphenWidget from "@biconomy/hyphen-widget/dist";
import "@biconomy/hyphen-widget/dist/index.css";

const hyphenWidget = HyphenWidget.default.init(document.getElementById("widget"), {
  tag: "my-awesome-dapp",
  env: "staging",
  showWidget: true,
  apiKeys: {
    Fuji: "Fuji API Key",
    Goerli: "Goerli API Key",
    Mumbai: "Mumbai API Key",
  },
  rpcUrls: {
    Fuji: "Fuji RPC URL",
    Goerli: "Goerli RPC URL",
    Mumbai: "Mumbai RPC URL",
  },
  ...
  // Other options.
});
```

## Methods

### open

Use the `open` method to open the modal:

```typescript
import * as HyphenWidget from "@biconomy/hyphen-widget/dist";
import "@biconomy/hyphen-widget/dist/index.css";

const hyphenWidget = HyphenWidget.default.init(document.getElementById("widget"), {
  tag: "my-awesome-dapp",
});

hyphenWidget.open();
```

### close

Use the `close` method to close the modal:

```typescript
import * as HyphenWidget from "@biconomy/hyphen-widget/dist";
import "@biconomy/hyphen-widget/dist/index.css";

const hyphenWidget = HyphenWidget.default.init(document.getElementById("widget"), {
  tag: "my-awesome-dapp",
});

hyphenWidget.close();
```
