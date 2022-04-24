import { BigNumber, BigNumberish, BytesLike, Signer } from 'ethers';
import { useCallback } from 'react';
import { useContractWrite, useWaitForTransaction } from 'wagmi';

import { usePreSalePrice } from './usePreSalePrice';
import { Provider } from '@ethersproject/providers';
import { loadContract, Version } from '@0xflair/contracts-registry';

type Config = {
  contractAddress?: string;
  version?: Version;
  signerOrProvider?: Signer | Provider;
  mintCount?: BigNumberish;
  allowlistProof?: BytesLike[];
};

export const usePreSaleMinter = ({
  contractAddress,
  version,
  signerOrProvider,
  mintCount,
  allowlistProof,
}: Config) => {
  const contract = loadContract(
    'collections/ERC721/extensions/ERC721PreSaleExtension',
    version,
  );

  const [
    {
      data: preSalePrice,
      error: preSalePriceError,
      loading: preSalePriceLoading,
    },
  ] = usePreSalePrice({
    contractAddress,
    version,
    signerOrProvider,
  });

  const [
    {
      data: cnMintPreSaleData,
      error: cnMintPreSaleError,
      loading: cnMintPreSaleLoading,
    },
    mintPreSaleWrite,
  ] = useContractWrite(
    {
      addressOrName: contractAddress as string,
      contractInterface: contract.artifact.abi,
      signerOrProvider,
    },
    'mintPreSale',
  );

  const [
    {
      data: txMintPreSaleData,
      error: txMintPreSaleError,
      loading: txMintPreSaleLoading,
    },
  ] = useWaitForTransaction({
    hash: cnMintPreSaleData?.hash,
    confirmations: 2,
  });

  const mintPreSale = useCallback(
    async (args?: {
      mintCount?: BigNumberish;
      allowlistProof?: BytesLike[];
    }) => {
      const response = await mintPreSaleWrite({
        args: [
          args?.mintCount || mintCount,
          args?.allowlistProof || allowlistProof,
        ],
        overrides: {
          value: BigNumber.from(preSalePrice).mul(
            BigNumber.from(args?.mintCount || mintCount),
          ),
        },
      });

      const receipt = await response.data?.wait(1);

      return { response, receipt };
    },
    [mintPreSaleWrite, preSalePrice, mintCount, allowlistProof],
  );

  return [
    {
      data: {
        preSalePrice,
        txResponse: cnMintPreSaleData,
        txReceipt: txMintPreSaleData,
      },
      error: preSalePriceError || cnMintPreSaleError || txMintPreSaleError,
      loading:
        preSalePriceLoading || cnMintPreSaleLoading || txMintPreSaleLoading,
    },
    mintPreSale,
  ] as const;
};
