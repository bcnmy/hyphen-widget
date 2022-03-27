# Hyphen Widget

This project is based on [Hyphen-UI](https://github.com/bcnmy/hyphen-ui/). Provide the UI as a widget that can be embedded in any page.

## Usage

### Prepare

1. Obtain Biconomy api keys from [Biconomy](https://dashboard.biconomy.io/)
2. Obtain RPC endpoints from somewhere like [Infura](https://infura.io/)

### With Vanilla JS

To use the widget in any html page, create an element and use `HyphenWidget.default.init`

```html
<div id="widget"></div>
<script src="./HyphenWidget.js" />
<script>
  const wid = HyphenWidget.default.init(
    document.getElementsByTagName('div')[0],
    {
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
        Goerli: 'https://your.infura.api.endpoint',
        Mumbai: 'https://your.infura.api.endpoint',
        Rinkeby: 'https://your.infura.api.endpoint',
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
    }
  );
</script>
```

### With React.js

It was designed to be compatible with React, but it failed to 🥲.
Leave a comment in [Issue#1](https://github.com/flyinglimao/hyphen-widget/issues/1) if you have some ideas.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
