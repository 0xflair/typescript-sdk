import { BytesLike } from 'ethers';

import {
  ContractReadByFeatureConfig,
  useContractReadByFeature,
} from '@0xflair/react-common';

type ResultType = BytesLike;
type ArgsType = {};

export const useStreamTicketToken = (
  config: ContractReadByFeatureConfig<ArgsType>,
) => {
  return useContractReadByFeature<ResultType, ArgsType>({
    tag: 'ticket_token',
    enabled: Boolean(config.contractAddress),
    ...config,
  });
};
