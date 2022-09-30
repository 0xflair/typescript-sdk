import {
  PredefinedReadContractConfig,
  useContractRead,
} from '@0xflair/react-common';
import { BigNumber, BigNumberish } from 'ethers';
import { useCallback, useEffect, useMemo, useState } from 'react';

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
  const [data, setData] = useState<BigNumber>();

  const { data: tierInfo } = useTierSaleInformation({
    chainId,
    contractAddress,
    tierId,
    enabled: enabled && tierId !== undefined,
  });

  const { data: tierSupply } = useTierSaleTotalSupply({
    chainId,
    contractAddress,
    tierId,
    enabled: enabled && tierId !== undefined,
  });

  const hook = useContractRead<BigNumberish, ArgsType>({
    contractFqn: 'collections/ERC721/extensions/ERC721TieringExtension',
    functionName: 'remainingForTier',
    chainId,
    contractAddress,
    args: [tierId] as ArgsType,
    enabled: enabled && tierId !== undefined,
    ...restOfConfig,
  });

  const call = useCallback(
    async (overrides?: { args?: ArgsType }) => {
      const result = await hook.call(overrides);

      if (
        result.data === undefined ||
        tierInfo === undefined ||
        tierSupply === undefined
      ) {
        setData(undefined);
        return undefined;
      }

      const remainingForTier = BigNumber.from(result.data || 0);
      const maxAllocation = BigNumber.from(tierInfo.maxAllocation || 0);
      const mintedSupply = BigNumber.from(tierSupply || 0);

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
    },
    [hook, tierInfo, tierSupply],
  );

  useEffect(() => {
    if (enabled && tierId !== undefined) {
      call();
    }
  }, [call, enabled, tierId]);

  return {
    ...hook,
    data,
    call,
  } as const;
};
