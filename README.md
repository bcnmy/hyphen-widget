# Hyphen Widget

This project is based on [Hyphen-UI](https://github.com/bcnmy/hyphen-ui/). Provide the UI as a widget that can be embedded in any page.
You can checkout [this page](https://flyinglimao.github.io/hyphen-widget/) to preview.

## Usage

### Prepare

1. Obtain Biconomy api keys from [Biconomy](https://dashboard.biconomy.io/)
2. Obtain RPC endpoints from somewhere like [Infura](https://infura.io/)

### With Vanilla JS

To use the widget in any html page, create an element and use `HyphenWidget.default.init`

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/flyinglimao/hyphen-widget@0.1.4/dist/index.css"
/>
<div id="widget"></div>
<script src="https://cdn.jsdelivr.net/gh/flyinglimao/hyphen-widget@0.1.4/dist/index.js"></script>
<script>
  const wid = HyphenWidget.default.init(document.getElementById('widget'), {
    test: true, // if you're using testnet, it's required
    apiKeys: {
      // required
      Fuji: 'your.biconomy.api.key',
      Goerli: 'your.biconomy.api.key',
      Mumbai: 'your.biconomy.api.key',
      Rinkeby: 'your.biconomy.api.key',
    },
    rpcUrls: {
      // required
      Goerli: 'https://your.eth.api.endpoint',
      Mumbai: 'https://your.eth.api.endpoint',
      Rinkeby: 'https://your.eth.api.endpoint',
    },
    // optional
    lockSourceChain: true,
    lockDestinationChain: true,
    lockToken: true,
    lockAmount: true,
    defaultDestinationChain: 'Mumbai',
    defaultSourceChain: 'Goerli',
    defaultToken: 'ETH',
    defaultAmount: '0.01',
    defaultReceiver: '0x000000000000000000000000000000000000dEaD',
    // NOTE: following 2 callback emit when tx is *sent*, you should check the status by yourself
    onDeposit: (e) => console.log('Deposit ' + e), // emit when depost tx is sent
    onExit: (e) => console.log('Exit ' + e), // emit when exit tx (receiver will receive tokens) is sent
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
    onChange: (input) => console.log('Input ' + JSON.stringify(input)),
  });
</script>
```

### With React.js

It was designed to be compatible with React, but it failed to 🥲.
Leave a comment in [Issue#1](https://github.com/flyinglimao/hyphen-widget/issues/1) if you have some ideas.
