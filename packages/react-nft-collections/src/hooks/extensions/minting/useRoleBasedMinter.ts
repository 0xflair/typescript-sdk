import { loadContract, Version } from '@0xflair/contracts-registry';
import { BigNumberish, BytesLike, Signer } from 'ethers';
import { useCallback } from 'react';
import { useContractWrite, useWaitForTransaction } from 'wagmi';
import { Provider } from '@ethersproject/providers';

type Config = {
  contractAddress?: string;
  version?: Version;
  signerOrProvider?: Signer | Provider;
  toAddress?: BytesLike;
  mintCount?: BigNumberish;
};

export const useRoleBasedMinter = ({
  contractAddress,
  version,
  signerOrProvider,
  toAddress,
  mintCount,
}: Config) => {
  const contract = loadContract(
    'collections/ERC721/extensions/ERC721RoleBasedMintExtension',
    version,
  );

  const [
    {
      data: cnMintByRoleData,
      error: cnMintByRoleError,
      loading: cnMintByRoleLoading,
    },
    mintByRoleWrite,
  ] = useContractWrite(
    {
      addressOrName: contractAddress as string,
      contractInterface: contract.artifact.abi,
      signerOrProvider,
    },
    'mintByRole',
  );

  const [
    {
      data: txMintByRoleData,
      error: txMintByRoleError,
      loading: txMintByRoleLoading,
    },
  ] = useWaitForTransaction({
    hash: cnMintByRoleData?.hash,
    confirmations: 2,
  });

  const mintByRole = useCallback(
    async (args?: { toAddress?: BytesLike; mintCount?: BigNumberish }) => {
      const response = await mintByRoleWrite({
        args: [args?.toAddress || toAddress, args?.mintCount || mintCount],
      });

      const receipt = await response.data?.wait(1);

      return { response, receipt };
    },
    [mintByRoleWrite, toAddress, mintCount],
  );

  return [
    {
      data: {
        txResponse: cnMintByRoleData,
        txReceipt: txMintByRoleData,
      },
      error: cnMintByRoleError || txMintByRoleError,
      loading: cnMintByRoleLoading || txMintByRoleLoading,
    },
    mintByRole,
  ] as const;
};
