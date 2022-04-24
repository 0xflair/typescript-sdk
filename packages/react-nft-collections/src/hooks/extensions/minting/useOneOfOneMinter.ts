import { loadContract, Version } from '@0xflair/contracts-registry';
import { BigNumberish, BytesLike, Signer } from 'ethers';
import { useCallback } from 'react';
import { useContractWrite, useWaitForTransaction } from 'wagmi';
import { Provider } from '@ethersproject/providers';

type Config = {
  contractAddress?: string;
  version?: Version;
  signerOrProvider?: Signer | Provider;
  toAddress?: string;
  mintCount?: string;
  tokenURIs?: string;
};

export const useOneOfOneMinter = ({
  contractAddress,
  version,
  signerOrProvider,
  toAddress,
  mintCount,
  tokenURIs,
}: Config) => {
  const contract = loadContract(
    'collections/ERC721/extensions/ERC721OneOfOneMintExtension',
    version,
  );

  const [
    {
      data: cnMintWithTokenURIsByOwnerData,
      error: cnMintWithTokenURIsByOwnerError,
      loading: cnMintWithTokenURIsByOwnerLoading,
    },
    mintWithTokenURIsByOwnerWrite,
  ] = useContractWrite(
    {
      addressOrName: contractAddress as string,
      contractInterface: contract.artifact.abi,
      signerOrProvider,
    },
    'mintWithTokenURIsByOwner',
  );

  const [
    {
      data: txMintWithTokenURIsByOwnerData,
      error: txMintWithTokenURIsByOwnerError,
      loading: txMintWithTokenURIsByOwnerLoading,
    },
  ] = useWaitForTransaction({
    hash: cnMintWithTokenURIsByOwnerData?.hash,
    confirmations: 2,
  });

  const mintWithTokenURIsByOwner = useCallback(
    async (args: {
      toAddress?: BytesLike;
      mintCount?: BigNumberish;
      tokenURIs?: BytesLike[];
    }) => {
      const response = await mintWithTokenURIsByOwnerWrite({
        args: [
          args.toAddress || toAddress,
          args.mintCount || mintCount,
          args.tokenURIs || tokenURIs,
        ],
      });

      const receipt = await response.data?.wait(1);

      return { response, receipt };
    },
    [mintWithTokenURIsByOwnerWrite, toAddress, mintCount, tokenURIs],
  );

  return [
    {
      data: {
        txResponse: cnMintWithTokenURIsByOwnerData,
        txReceipt: txMintWithTokenURIsByOwnerData,
      },
      error: cnMintWithTokenURIsByOwnerError || txMintWithTokenURIsByOwnerError,
      loading:
        cnMintWithTokenURIsByOwnerLoading || txMintWithTokenURIsByOwnerLoading,
    },
    mintWithTokenURIsByOwner,
  ] as const;
};
