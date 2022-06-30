import { BigNumberish } from 'ethers';

import {
  ContractReadByFeatureConfig,
  useContractReadByFeature,
} from '@0xflair/react-common';

type ResultType = BigNumberish[];
type ArgsType = {};

export const useStreamEmissionEnd = (
  config: ContractReadByFeatureConfig<ArgsType>,
) => {
  return useContractReadByFeature<ResultType, ArgsType>({
    tag: 'emission_end',
    enabled: Boolean(config.contractAddress),
    ...config,
  });
};
