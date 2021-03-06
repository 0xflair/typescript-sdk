import { ContractVersion } from '@0xflair/contracts-registry';
import { useContractAbi, useContractWriteAndWait } from '@0xflair/react-common';
import { Provider } from '@ethersproject/providers';
import { ReadContractConfig } from '@wagmi/core';
import { BigNumberish, BytesLike, Signer } from 'ethers';

type Config = Partial<ReadContractConfig> & {
  contractVersion?: ContractVersion;
  enabled?: boolean;
  contractAddress?: string;
  signerOrProvider?: Signer | Provider | null;
  role?: BytesLike;
  to?: BytesLike;
  amount?: BigNumberish;
};

type ArgsType = [to?: BytesLike, amount?: BigNumberish];

export const useERC20RoleBasedMint = ({
  contractVersion,
  contractAddress,
  signerOrProvider,
  role,
  to,
  amount,
  ...restOfConfig
}: Config) => {
  const contractInterface = useContractAbi({
    contractVersion,
    contractFqn: 'openzeppelin/token/ERC20/presets/ERC20PresetMinterPauser',
  });

  return useContractWriteAndWait<ArgsType>({
    contractInterface,
    functionName: 'mint',
    args: [to, amount],
    contractAddress,
    signerOrProvider,
    ...restOfConfig,
  });
};
