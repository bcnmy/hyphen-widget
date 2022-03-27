import { chains, chainMap } from './chains';
import tokens from './tokens';
import constants from './constants';

const hyphen = {
  baseURL: {
    test: 'https://hyphen-test-api.biconomy.io',
    prod: 'https://hyphen-api.biconomy.io',
  },
  getTokenGasPricePath: '/api/v1/insta-exit/get-token-price',
};

export const config = {
  chains,
  chainMap,
  tokens,
  hyphen,
  constants,
};

export default config;
