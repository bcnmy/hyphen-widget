import { ChainConfig } from '..';
import { NATIVE_ADDRESS } from '../../constants';
import ethIcon from '../../../assets/images/tokens/eth-icon.svg';

export const RINKEBY: ChainConfig = {
  name: 'Rinkeby',
  image: ethIcon,
  subText: 'Ethereum testnet',
  chainId: 4,
  rpcUrl: '',
  currency: 'RETH',
  nativeToken: NATIVE_ADDRESS,
  nativeDecimal: 18,
  nativeFaucetURL: 'https://rinkeby-faucet.com/',
  assetSentTopicId:
    '0xec1dcc5633614eade4a5730f51adc7444a5103a8477965a32f2e886f5b20f694',
  biconomy: {
    enable: true,
    apiKey: '',
  },
  graphURL: 'https://api.thegraph.com/subgraphs/name/divyan73/hyphen-rinkeby',
  networkAgnosticTransfer: false,
  explorerUrl: 'https://rinkeby.etherscan.io',
};
