import { Version } from '@0xflair/contracts-registry';
import { Environment, useAddressOfSigner } from '@0xflair/react-common';
import { Provider } from '@ethersproject/providers';
import { BigNumberish, BytesLike, Signer } from 'ethers';
import { useCallback } from 'react';

import { useOwnerMinter } from './useOwnerMinter';
import { useRoleBasedMinter } from './useRoleBasedMinter';

type Config = {
  env?: Environment;
  chainId?: number;
  contractAddress?: string;
  version?: Version;
  signerOrProvider?: Signer | Provider;
  minterAddress?: string;
  toAddress?: BytesLike;
  mintCount?: BigNumberish;
};

/**
 * Consolidated function for minting as admin without paying (either contract owner, or having minter role).
 */
export const useAdminMinter = ({
  env,
  chainId,
  contractAddress,
  version,
  signerOrProvider,
  minterAddress,
  toAddress,
  mintCount,
}: Config) => {
  // const [{ data: ownerData, error: ownerError, loading: ownerLoading }] =
  //   useOzOwner({
  //     contractAddress,
  //     version,
  //   });
  // const [{ data: hasRoleData, error: hasRoleError, loading: hasRoleLoading }] =
  //   useOzHasRole({
  //     contractAddress,
  //     version,
  //     address: minterAddress,
  //     role: keccak256(toUtf8Bytes('MINTER_ROLE')),
  //   });
  //   const isOwner = ownerData?.toString().toLowerCase() ===
  //   minterAddress?.toString().toLowerCase();
  //   const hasMinterRole = hasRoleData?.toString() === 'true';
  // const [
  //   {
  //     data: mintByOwnerData,
  //     error: mintByOwnerError,
  //     loading: mintByOwnerLoading,
  //   },
  //   mintByOwnerWrite,
  // ] = useOwnerMinter({
  //   contractAddress,
  //   version,
  //   toAddress,
  //   mintCount,
  // });
  // const [
  //   {
  //     data: mintByRoleData,
  //     error: mintByRoleError,
  //     loading: mintByRoleLoading,
  //   },
  //   mintByRoleWrite,
  // ] = useRoleBasedMinter({
  //   contractAddress,
  //   version,
  //   toAddress,
  //   mintCount,
  // });
  // const possible =
  //   mintModesInfo?.ByOwner?.possible || mintModesInfo?.ByRole?.possible;
  // const reason =
  //   mintModesInfo?.ByOwner?.reason || mintModesInfo?.ByRole?.reason;
  // const mintAsAdmin = useCallback(
  //   (args?: { toAddress?: BytesLike; mintCount?: BigNumberish }) => {
  //     if (mintModesInfo?.ByOwner?.possible) {
  //       mintByOwnerWrite({
  //         ...args,
  //       });
  //     } else if (mintModesInfo?.ByRole?.possible) {
  //       mintByRoleWrite({
  //         ...args,
  //       });
  //     }
  //   },
  //   [
  //     mintByOwnerWrite,
  //     mintByRoleWrite,
  //     mintModesInfo?.ByOwner?.possible,
  //     mintModesInfo?.ByRole?.possible,
  //   ],
  // );
  // return [
  //   {
  //     data: { possible, reason, mintData: mintByOwnerData || mintByRoleData },
  //     error: mintModesError || mintByOwnerError || mintByRoleError,
  //     loading: mintModesLoading || mintByOwnerLoading || mintByRoleLoading,
  //   },
  //   mintAsAdmin,
  // ] as const;
};
