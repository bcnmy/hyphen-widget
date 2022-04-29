import { AVALANCHE } from "../chains/constants/Avalanche";
import { FUJI } from "../chains/constants/Fuji";
import { NATIVE_ADDRESS } from "../constants";
import { TokenConfig } from ".";
import avaxIcon from "../../assets/images/tokens/avax-icon.svg";

export const AVAX: TokenConfig = {
  symbol: "AVAX",
  image: avaxIcon,
  coinGeckoId: "avalanche-2",
  [AVALANCHE.chainId]: {
    address: NATIVE_ADDRESS,
    transferOverhead: 127000,
    decimal: 18,
    symbol: "AVAX",
    chainColor: AVALANCHE.chainColor,
    isSupported: false,
  },
  [FUJI.chainId]: {
    address: NATIVE_ADDRESS,
    transferOverhead: 127000,
    decimal: 18,
    symbol: "AVAX",
    fixedDecimalPoint: 5,
    chainColor: FUJI.chainColor,
    isSupported: false,
  },
};
