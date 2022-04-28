import { AVALANCHE } from "../chains/constants/Avalanche";
import { ETHEREUM } from "../chains/constants/Ethereum";
import { FUJI } from "../chains/constants/Fuji";
import { GOERLI } from "../chains/constants/Goerli";
import { MUMBAI } from "../chains/constants/Mumbai";
import { POLYGON } from "../chains/constants/Polygon";
import { LiquidityContractConfig } from ".";

export const LiquidityPool: LiquidityContractConfig = {
  name: "LiquidityPool",
  [MUMBAI.chainId]: {
    address: "0xDe4e4CDa407Eee8d9E76261a1F2d229A572743dE",
  },
  [GOERLI.chainId]: {
    address: "0x8033Bd14c4C114C14C910fe05Ff13DB4C481a85D",
  },
  [FUJI.chainId]: {
    address: "0xB726675394b2dDeE2C897ad31a62C7545Ad7C68D",
  },
  [POLYGON.chainId]: {
    address: "0x2A5c2568b10A0E826BfA892Cf21BA7218310180b",
  },
  [ETHEREUM.chainId]: {
    address: "0x2A5c2568b10A0E826BfA892Cf21BA7218310180b",
  },
  [AVALANCHE.chainId]: {
    address: "0x2A5c2568b10A0E826BfA892Cf21BA7218310180b",
  },
};
