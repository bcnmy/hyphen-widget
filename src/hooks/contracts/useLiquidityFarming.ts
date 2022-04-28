import { useCallback, useMemo } from 'react';
import { BigNumber, ethers } from 'ethers';
import liquidityFarmingABI from 'abis/LiquidityFarming.abi.json';
import { LiquidityFarming } from 'config/liquidityContracts/LiquidityFarming';
import { ChainConfig } from 'config/chains';
import { useWalletProvider } from 'context/WalletProvider';

function useLiquidityFarming(chain: ChainConfig | undefined) {
  const { signer } = useWalletProvider()!;
  const contractAddress = chain
    ? LiquidityFarming[chain.chainId].address
    : undefined;

  const liquidityFarmingContract = useMemo(() => {
    if (!chain || !contractAddress) return;

    return new ethers.Contract(
      contractAddress,
      liquidityFarmingABI,
      new ethers.providers.JsonRpcProvider(chain.rpcUrl),
    );
  }, [chain, contractAddress]);

  const liquidityFarmingContractSigner = useMemo(() => {
    if (!contractAddress || !signer) return;

    return new ethers.Contract(contractAddress, liquidityFarmingABI, signer);
  }, [contractAddress, signer]);

  const claimFee = useCallback(
    (positionId: BigNumber, accounts: string[]) => {
      if (!liquidityFarmingContractSigner || !positionId || !accounts) return;

      return liquidityFarmingContractSigner.extractRewards(
        positionId,
        accounts[0],
      );
    },
    [liquidityFarmingContractSigner],
  );

  const getPendingToken = useCallback(
    (positionId: BigNumber) => {
      if (!liquidityFarmingContract) return;

      return liquidityFarmingContract.pendingToken(positionId);
    },
    [liquidityFarmingContract],
  );

  const getStakedUserPositions = useCallback(
    (accounts: string[]) => {
      if (!liquidityFarmingContract || !accounts) return;

      return liquidityFarmingContract.getNftIdsStaked(accounts[0]);
    },
    [liquidityFarmingContract],
  );

  const getRewardRatePerSecond = useCallback(
    (address: string) => {
      if (!liquidityFarmingContract) return;

      return liquidityFarmingContract.getRewardRatePerSecond(address);
    },
    [liquidityFarmingContract],
  );

  const getRewardTokenAddress = useCallback(
    (address: string) => {
      if (!liquidityFarmingContract) return;

      return liquidityFarmingContract.rewardTokens(address);
    },
    [liquidityFarmingContract],
  );

  const getTotalSharesStaked = useCallback(
    (address: string) => {
      if (!liquidityFarmingContract) return;

      return liquidityFarmingContract.totalSharesStaked(address);
    },
    [liquidityFarmingContract],
  );

  const stakeNFT = useCallback(
    (positionId: BigNumber, accounts: string[]) => {
      if (!liquidityFarmingContractSigner || !positionId || !accounts) return;

      return liquidityFarmingContractSigner.deposit(positionId, accounts[0]);
    },
    [liquidityFarmingContractSigner],
  );

  const unstakeNFT = useCallback(
    (positionId: BigNumber, accounts: string[]) => {
      if (!liquidityFarmingContractSigner || !positionId || !accounts) return;

      return liquidityFarmingContractSigner.withdraw(positionId, accounts[0]);
    },
    [liquidityFarmingContractSigner],
  );

  return {
    claimFee,
    getPendingToken,
    getStakedUserPositions,
    getRewardRatePerSecond,
    getRewardTokenAddress,
    getTotalSharesStaked,
    stakeNFT,
    unstakeNFT,
  };
}

export default useLiquidityFarming;
