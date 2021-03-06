import { ethers } from 'ethers';
import { Network } from 'hooks/useNetworks';

export async function switchNetwork(
  walletProvider: ethers.providers.Web3Provider,
  chain: Network,
) {
  const params = {
    chainId: `0x${chain.chainId.toString(16)}`, // A 0x-prefixed hexadecimal string
    chainName: chain.name,
    nativeCurrency: {
      name: chain.currency,
      symbol: chain.currency, // 2-6 characters long
      decimals: chain.nativeDecimal,
    },
    rpcUrls: [chain.rpc],
    blockExplorerUrls: [chain.explorerUrl],
  };

  try {
    const changeReq = await walletProvider.send('wallet_switchEthereumChain', [
      { chainId: params.chainId },
    ]);
    return changeReq;
  } catch (e: any) {
    if (e.code === 4902) {
      let addReq = await walletProvider.send('wallet_addEthereumChain', [
        params,
      ]);
      return addReq;
    }
  }
}

export default switchNetwork;
