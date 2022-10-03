import {
  PredefinedReadContractConfig,
  useContractRead,
} from '@0xflair/react-common';
import { BigNumber, BigNumberish } from 'ethers';
import { useCallback, useEffect, useState } from 'react';

import { useTierSaleInformation } from './useTierSaleInformation';
import { useTierSaleTotalSupply } from './useTierSaleTotalSupply';

type ArgsType = [tierId: BigNumberish];

type Config = {
  tierId?: BigNumberish;
} & PredefinedReadContractConfig<ArgsType>;

export const useTierSaleRemainingSupply = ({
  chainId,
  contractAddress,
  enabled = true,
  tierId,
  ...restOfConfig
}: Config) => {
  const [error, setError] = useState<Error | string>();
  const [data, setData] = useState<BigNumber>();

  const { call: getTierInfo } = useTierSaleInformation({
    chainId,
    contractAddress,
    tierId,
    enabled: enabled && tierId !== undefined,
  });

  const { call: getTierSupply } = useTierSaleTotalSupply({
    chainId,
    contractAddress,
    tierId,
    enabled: enabled && tierId !== undefined,
  });

  const hook = useContractRead<BigNumberish, ArgsType>({
    contractFqn: 'collections/ERC721/extensions/ERC721TieringExtension',
    cacheTime: 10,
    staleTime: 2,
    functionName: 'remainingForTier',
    chainId,
    contractAddress,
    args: [tierId] as ArgsType,
    enabled: enabled && tierId !== undefined,
    ...restOfConfig,
  });

  const call = useCallback(
    async (tierId?: BigNumberish) => {
      try {
        setError(undefined);

        const remainingSupply = await hook.call(
          tierId !== undefined ? { args: [tierId] } : undefined,
        );
        const tierInfo = await getTierInfo(
          tierId !== undefined ? { args: [tierId] } : undefined,
        );
        const tierMinted = await getTierSupply(
          tierId !== undefined ? { args: [tierId] } : undefined,
        );

        if (
          remainingSupply === undefined ||
          tierInfo === undefined ||
          tierMinted === undefined
        ) {
          setData(undefined);
          return undefined;
        }

        const remainingForTier = BigNumber.from(remainingSupply || 0);
        const maxAllocation = BigNumber.from(tierInfo.maxAllocation || 0);
        const mintedSupply = BigNumber.from(tierMinted || 0);

        if (maxAllocation.gt(0)) {
          if (maxAllocation.gt(mintedSupply)) {
            if (maxAllocation.sub(mintedSupply).lt(remainingForTier)) {
              return maxAllocation.sub(mintedSupply);
            }
          } else {
            return BigNumber.from(0);
          }
        }

        setData(remainingForTier);
        return remainingForTier;
      } catch (error: any) {
        setData(undefined);
        setError(error);
      }
    },
    [getTierInfo, getTierSupply, hook],
  );

  useEffect(() => {
    if (enabled && tierId !== undefined) {
      call();
    }
  }, [call, enabled, tierId]);

  return {
    ...hook,
    error: error || hook.error,
    data,
    call,
  } as const;
};
