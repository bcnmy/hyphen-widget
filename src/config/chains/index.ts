import { ENV } from '../../types/environment';
import { chainMap } from './chainMap';

import { MUMBAI } from './constants/Mumbai';
import { AVALANCHE } from './constants/Avalanche';
import { GOERLI } from './constants/Goerli';
import { FUJI } from './constants/Fuji';
import { RINKEBY } from './constants/Rinkeby';
import { ETHEREUM } from './constants/Ethereum';
import { POLYGON } from './constants/Polygon';

export type Chains =
  | 'Avalanche'
  | 'Ethereum'
  | 'Fuji'
  | 'Goerli'
  | 'Polygon'
  | 'Mumbai'
  | 'Rinkeby';

export type ChainConfig = {
  name: Chains;
  image?: string;
  subText: string;
  chainId: number;
  rpcUrl: string;
  currency: string;
  nativeDecimal: number;
  nativeToken: string;
  nativeFaucetURL: string;
  biconomy: {
    enable: boolean;
    apiKey: string;
  };
  assetSentTopicId: string;
  networkAgnosticTransfer: boolean;
  graphURL: string;
  explorerUrl: string;
};

export const chains: ChainConfig[] = [
  POLYGON,
  ETHEREUM,
  AVALANCHE,
  MUMBAI,
  GOERLI,
  FUJI,
  RINKEBY,
];
export { chainMap };
