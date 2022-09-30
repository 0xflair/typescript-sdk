import {
  PredefinedReadContractConfig,
  useContractRead,
} from '@0xflair/react-common';
import { BigNumberish } from 'ethers';

import { Tier } from '../types';

type ArgsType = [tierId: BigNumberish];

type Config = {
  tierId?: BigNumberish;
} & PredefinedReadContractConfig<ArgsType>;

export const useTierSaleInformation = (config: Config) => {
  const result = useContractRead<any[], ArgsType>({
    contractFqn: 'collections/ERC721/extensions/ERC721TieringExtension',
    cacheTime: 60,
    staleTime: 5,
    functionName: 'tiers',
    args: [config.tierId] as ArgsType,
    enabled:
      config.enabled && config.tierId !== undefined && config.tierId !== null,
    ...config,
  });

  return {
    ...result,
    data: result?.data
      ? ({
          start: result.data[0].toString(),
          end: result.data[1].toString(),
          currency: result.data[2].toString(),
          price: result.data[3].toString(),
          maxPerWallet: result.data[4].toString(),
          merkleRoot: result.data[5].toString(),
          reserved: result.data[6].toString(),
          maxAllocation: result.data[7].toString(),
          isSavedOnChain: true,
        } as Tier)
      : undefined,
  };
};
