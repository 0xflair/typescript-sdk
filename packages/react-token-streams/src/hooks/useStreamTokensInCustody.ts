import { V1_22_ERC721CustodialStakingExtension__factory } from '@0xflair/contracts-registry';
import {
  Environment,
  PredefinedReadContractConfig,
  useHasAnyOfFeatures,
} from '@0xflair/react-common';
import { useNftTokensByWallet } from '@0xflair/react-data-query';
import { useERC721TotalSupply } from '@0xflair/react-openzeppelin';
import { BytesLike } from '@ethersproject/bytes';
import { BigNumber, BigNumberish } from 'ethers';
import { useCallback, useMemo, useState } from 'react';
import { useAccount, useProvider } from 'wagmi';

type ArgsType = [tierId: BigNumberish];

type Config = {
  env?: Environment;
  ticketTokenAddress?: BytesLike;
  walletAddress?: BytesLike;
} & PredefinedReadContractConfig<ArgsType>;

export const useStreamTokensInCustody = (config: Config) => {
  const { data: account } = useAccount();

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<BigNumberish[]>();
  const [error, setError] = useState<string | Error | null>();

  const finalWalletAddress =
    config.walletAddress?.toString() || account?.address;

  const {
    data: supportsTokensInCustody,
    error: supportsTokensInCustodyError,
    isLoading: supportsTokensInCustodyLoading,
  } = useHasAnyOfFeatures({
    env: config.env,
    chainId: config.chainId,
    contractAddress: config.contractAddress,
    tags: [
      'flair_stream_custodial_staking_extension',
      'has_stream_custodial_staking_extension',
      'tokens_in_custody',
    ],
  });

  const {
    data: allTokensInCustody,
    error: allTokensInCustodyError,
    isLoading: allTokensInCustodyLoading,
  } = useNftTokensByWallet({
    env: config.env,
    chainId: config.chainId,
    collectionAddress: config.ticketTokenAddress?.toString(),
    walletAddress: config.contractAddress,
  });

  const { data: totalSupply } = useERC721TotalSupply({
    chainId: config.chainId,
    contractAddress: config.ticketTokenAddress?.toString() as string,
    enabled: Boolean(config.ticketTokenAddress && supportsTokensInCustody),
  });

  const provider = useProvider({
    chainId: config.chainId,
  });
  const contract = useMemo(() => {
    if (!config.contractAddress || !provider) {
      return;
    }
    return V1_22_ERC721CustodialStakingExtension__factory.connect(
      config.contractAddress,
      provider,
    );
  }, [config.contractAddress, provider]);

  const fetchTokensInCustodyInRange = useCallback(
    async (startTokenId: BigNumberish, endTokenId: BigNumberish) => {
      if (!contract || !finalWalletAddress) {
        return;
      }

      const result = (await contract.tokensInCustody(
        finalWalletAddress,
        startTokenId,
        endTokenId,
      )) as boolean[];

      return result.reduce<BigNumberish[]>(
        (list, inCustody, tokenIdMinusStartTokenId) =>
          inCustody
            ? [
                ...list,
                BigNumber.from(startTokenId).add(tokenIdMinusStartTokenId),
              ]
            : list,
        [],
      );
    },
    [finalWalletAddress, contract],
  );

  const refetchTokensInCustody = useCallback(async () => {
    if (isLoading) {
      return;
    }

    if (supportsTokensInCustody && contract && finalWalletAddress) {
      try {
        setError(undefined);
        setIsLoading(true);
        const finalData: BigNumberish[] = [];

        // Enumerate to 20,000
        const custodyStatusesPromises = [];

        for (
          let i = 0, l = Number(totalSupply?.toString() || 20_000);
          i <= l;
          i = i + 500 + 1
        ) {
          custodyStatusesPromises.push(fetchTokensInCustodyInRange(i, i + 500));
        }

        for (const tokens of await Promise.all(custodyStatusesPromises)) {
          if (tokens && tokens.length) {
            finalData.push(...tokens);
          }
        }

        if (!finalData.length && allTokensInCustody) {
          const custodyStatuses = await Promise.all(
            allTokensInCustody.map((token) =>
              contract.tokensInCustody(
                finalWalletAddress,
                token.tokenId,
                token.tokenId,
              ),
            ),
          );

          for (let i = 0; i < custodyStatuses.length; i++) {
            const [inCustody] = custodyStatuses[i];

            if (inCustody) {
              finalData.push(allTokensInCustody[i].tokenId);
            }
          }
        }

        setData(finalData);
      } catch (error) {
        setData(undefined);
        setError(error as Error);
      }

      setIsLoading(false);
    }
  }, [
    allTokensInCustody,
    contract,
    fetchTokensInCustodyInRange,
    finalWalletAddress,
    isLoading,
    supportsTokensInCustody,
    totalSupply,
  ]);

  useMemo(() => {
    if (
      !supportsTokensInCustody ||
      (allTokensInCustodyLoading && !allTokensInCustody)
    ) {
      return;
    }

    refetchTokensInCustody();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supportsTokensInCustody, finalWalletAddress, allTokensInCustody]);

  return {
    data,
    error: error || supportsTokensInCustodyError,
    isLoading: isLoading || supportsTokensInCustodyLoading,
    refetchTokensInCustody,
  } as const;
};
