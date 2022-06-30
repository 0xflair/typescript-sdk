import { BigNumberish } from 'ethers';

import {
  ContractReadByFeatureConfig,
  useContractReadByFeature,
} from '@0xflair/react-common';

type ResultType = BigNumberish[];
type ArgsType = {};

export const useStreamEmissionTimeUnit = (
  config: ContractReadByFeatureConfig<ArgsType>,
) => {
  return useContractReadByFeature<ResultType, ArgsType>({
    tag: 'emission_time_unit',
    enabled: Boolean(config.contractAddress),
    ...config,
  });
};
