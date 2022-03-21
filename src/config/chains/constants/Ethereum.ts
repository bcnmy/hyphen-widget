import { ChainConfig } from '..';
import { NATIVE_ADDRESS } from '../../constants';
import ethIcon from '../../../assets/images/tokens/eth-icon.svg';

export const ETHEREUM: ChainConfig = {
  name: 'Ethereum',
  image: ethIcon,
  subText: 'Ethereum Mainnet',
  chainId: 1,
  rpcUrl: '',
  currency: 'ETH',
  nativeToken: NATIVE_ADDRESS,
  nativeDecimal: 18,
  nativeFaucetURL: '',
  assetSentTopicId:
    '0xec1dcc5633614eade4a5730f51adc7444a5103a8477965a32f2e886f5b20f694',
  biconomy: {
    enable: false,
    apiKey: '',
  },
  graphURL: 'https://api.thegraph.com/subgraphs/name/divyan73/hyphenethereumv2',
  networkAgnosticTransfer: false,
  explorerUrl: 'https://etherscan.io/',
};
