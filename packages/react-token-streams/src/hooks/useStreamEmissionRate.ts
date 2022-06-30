import { BigNumberish } from 'ethers';

import {
  ContractReadByFeatureConfig,
  useContractReadByFeature,
} from '@0xflair/react-common';

type ResultType = BigNumberish;
type ArgsType = {};

export const useStreamEmissionRate = (
  config: ContractReadByFeatureConfig<ArgsType>,
) => {
  return useContractReadByFeature<ResultType, ArgsType>({
    tag: 'emission_rate',
    enabled: Boolean(config.contractAddress),
    ...config,
  });
};
