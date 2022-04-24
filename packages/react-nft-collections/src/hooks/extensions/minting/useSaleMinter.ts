import { BigNumberish, BytesLike, Signer } from 'ethers';
import { useCallback } from 'react';

import { usePreSaleMinter } from '../sales/usePreSaleMinter';
import { usePublicSaleMinter } from '../sales/usePublicSaleMinter';

import { Environment } from '@0xflair/react-common';
import { Version } from '@0xflair/contracts-registry';
import { Provider } from '@ethersproject/providers';

type Config = {
  env?: Environment;
  chainId?: number;
  contractAddress?: string;
  version?: Version;
  signerOrProvider?: Signer | Provider;
  minterAddress?: BytesLike;
  toAddress?: BytesLike;
  mintCount?: BigNumberish;
};

/**
 * Consolidated function for minting as collectors by paying price of pre-sale or public-sale.
 */
export const useSaleMinter = ({
  env,
  chainId,
  contractAddress,
  version,
  minterAddress,
  signerOrProvider,
  mintCount,
}: Config) => {
  // const [
  //   {
  //     data: {
  //       mintModesInfo,
  //       isAllowlisted,
  //       allowlistProof,
  //       preSaleStatus,
  //       publicSaleStatus,
  //     },
  //     error: mintModesError,
  //     loading: mintModesLoading,
  //   },
  // ] = useMintModes({
  //   env,
  //   chainId,
  //   contractAddress,
  //   version,
  //   minterAddress,
  // });

  // const [
  //   {
  //     data: preSaleMintData,
  //     error: preSaleMintError,
  //     loading: preSaleMintLoading,
  //   },
  //   preSaleMintWrite,
  // ] = usePreSaleMinter({
  //   contractAddress,
  //   version,
  //   signerOrProvider,
  //   mintCount,
  //   allowlistProof,
  // });

  // const [
  //   {
  //     data: publicSaleMintData,
  //     error: publicSaleMintError,
  //     loading: publicSaleMintLoading,
  //   },
  //   publicSaleMintWrite,
  // ] = usePublicSaleMinter({
  //   contractAddress,
  //   version,
  //   signerOrProvider,
  //   mintCount,
  // });

  // const possible =
  //   mintModesInfo?.PreSale?.possible || mintModesInfo?.PublicSale?.possible;
  // const reason =
  //   mintModesInfo?.PreSale?.reason || mintModesInfo?.PublicSale?.reason;

  // const mint = useCallback(
  //   (args?: { mintCount?: BigNumberish; allowlistProof?: BytesLike[] }) => {
  //     if (mintModesInfo?.PreSale?.possible) {
  //       preSaleMintWrite({
  //         mintCount: args?.mintCount || mintCount,
  //         allowlistProof: args?.allowlistProof || allowlistProof,
  //       });
  //     } else if (mintModesInfo?.PublicSale?.possible) {
  //       publicSaleMintWrite({
  //         mintCount: args?.mintCount || mintCount,
  //       });
  //     }
  //   },
  //   [
  //     mintModesInfo?.PreSale?.possible,
  //     mintModesInfo?.PublicSale?.possible,
  //     preSaleMintWrite,
  //     publicSaleMintWrite,
  //     mintCount,
  //     allowlistProof,
  //   ],
  // );

  // return [
  //   {
  //     data: {
  //       possible,
  //       reason,
  //       txResponse: preSaleMintData.txResponse || publicSaleMintData.txResponse,
  //       txReceipt: preSaleMintData.txReceipt || publicSaleMintData.txReceipt,
  //       preSaleStatus,
  //       preSaleMintPossible: mintModesInfo?.PreSale?.possible,
  //       preSalePrice: preSaleMintData.preSalePrice,
  //       preSaleIsAllowlisted: isAllowlisted,
  //       publicSaleStatus,
  //       publicSaleMintPossible: mintModesInfo?.PublicSale?.possible,
  //       publicSalePrice: publicSaleMintData.publicSalePrice,
  //     },
  //     error: mintModesError || preSaleMintError || publicSaleMintError,
  //     loading: mintModesLoading || preSaleMintLoading || publicSaleMintLoading,
  //   },
  //   mint,
  // ] as const;
};
