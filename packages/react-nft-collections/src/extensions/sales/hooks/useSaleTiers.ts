import { Environment } from '@0xflair/common';
import { V1_22_ERC721TieringExtension__factory } from '@0xflair/contracts-registry';
import {
  PredefinedReadContractConfig,
  useHasAnyOfFeatures,
  ZERO_BYTES32,
} from '@0xflair/react-common';
import { BigNumber, BigNumberish, BytesLike } from 'ethers';
import { useCallback, useMemo, useState } from 'react';
import { useProvider } from 'wagmi';

import { Tier } from '../types';
import { useSimpleSaleMinter } from './useSimpleSaleMinter';
import { useTierSaleAllowlistChecker } from './useTierSaleAllowlistChecker';
import { useTierSaleEligibleAmount } from './useTierSaleEligibleAmount';
import { useTierSaleRemainingSupply } from './useTierSaleRemainingSupply';

type ArgsType = [tierId: BigNumberish];

type Config = {
  env?: Environment;
  minterAddress?: BytesLike;
} & PredefinedReadContractConfig<ArgsType>;

export const useSaleTiers = (config: Config) => {
  const [error, setError] = useState<Error | string>();
  const [isLoading, setIsLoading] = useState(false);
  const [tiers, setTiers] = useState<Record<number, Tier>>([]);

  const {
    data: supportsSimpleSales,
    error: supportsSimpleSalesError,
    isLoading: supportsSimpleSalesLoading,
  } = useHasAnyOfFeatures({
    env: config.env,
    chainId: config.chainId,
    contractAddress: config.contractAddress,
    tags: [
      'erc721_public_sale_extension',
      'erc721_presale_extension',
      'mint_amount_by_merkle_proof',
    ],
  });

  const {
    data: supportsTieredSales,
    error: supportsTieredSalesError,
    isLoading: supportsTieredSalesLoading,
  } = useHasAnyOfFeatures({
    env: config.env,
    chainId: config.chainId,
    contractAddress: config.contractAddress,
    tags: ['erc721_tiering_extension', 'mint_by_tier_with_allowance_and_proof'],
  });

  const {
    error: allowlistCheckerError,
    isLoading: allowlistCheckerLoading,
    call: checkAllowlist,
  } = useTierSaleAllowlistChecker({
    env: config.env,
    chainId: config.chainId,
    contractAddress: config.contractAddress,
    minterAddress: config.minterAddress,
    enabled: false,
  });

  const {
    error: eligibleAmountError,
    isLoading: eligibleAmountLoading,
    call: getEligibleAmount,
  } = useTierSaleEligibleAmount({
    chainId: config.chainId,
    contractAddress: config.contractAddress,
    minterAddress: config.minterAddress,
    enabled: false,
  });

  const {
    error: tierSupplyError,
    isLoading: tierSupplyLoading,
    call: getTierRemainingSupply,
  } = useTierSaleRemainingSupply({
    chainId: config.chainId,
    contractAddress: config.contractAddress,
    enabled: false,
  });

  const {
    data: {
      preSaleStatus,
      preSalePrice,
      preSaleMaxMintPerWallet,
      preSaleIsAllowlisted,
      publicSaleStatus,
      publicSalePrice,
      publicSaleMaxMintPerTx,
    },
    error: {
      preSaleStatusError,
      preSaleAllowlistCheckerError,
      preSaleMaxMintPerWalletError,
      preSaleMintError,
      publicSaleMaxMintPerTxError,
      publicSaleMintError,
      publicSaleStatusError,
    },
    isLoading: {
      preSaleAllowlistCheckerLoading,
      preSaleMaxMintPerWalletLoading,
      preSaleMintLoading,
      preSaleStatusLoading,
      publicSaleMaxMintPerTxLoading,
      publicSaleMintLoading,
      publicSaleStatusLoading,
    },
  } = useSimpleSaleMinter({
    chainId: config.chainId,
    contractAddress: config.contractAddress,
    contractVersion: config.contractVersion,
    minterAddress: config.minterAddress,
    enabled: supportsSimpleSales,
  });

  const provider = useProvider({
    chainId: config.chainId,
  });
  const contract = useMemo(() => {
    if (!config.contractAddress || !provider) {
      return;
    }
    return V1_22_ERC721TieringExtension__factory.connect(
      config.contractAddress,
      provider,
    );
  }, [config.contractAddress, provider]);

  const fetchTierById = useCallback(
    async (tierId: BigNumberish) => {
      if (!contract) {
        return;
      }

      const tier = (await contract.tiers(tierId)) as Tier;

      const now = new Date();

      const start =
        tier?.start !== undefined
          ? new Date(Number(tier?.start.toString()) * 1000)
          : undefined;
      const end =
        tier?.end !== undefined
          ? new Date(Number(tier?.end.toString()) * 1000)
          : undefined;
      const isActive = start && end ? start <= now && end > now : undefined;
      const hasAllowlist = tier?.merkleRoot
        ? tier.merkleRoot !== ZERO_BYTES32
        : undefined;

      const { isAllowlisted, merkleMetadata, merkleProof } =
        isActive && hasAllowlist
          ? await checkAllowlist({
              tierId,
              merkleRoot: tier.merkleRoot,
            })
          : ({} as any);

      const eligibleAmount =
        isActive &&
        config.minterAddress &&
        (merkleProof !== undefined || !hasAllowlist)
          ? await getEligibleAmount({
              tierId,
              minterAddress: config.minterAddress,
              maxAllowance: merkleMetadata?.maxAllowance,
              merkleProof,
            })
          : undefined;

      const remainingSupply = await getTierRemainingSupply(tierId);

      return {
        ...tier,
        isSavedOnChain: true,
        isActive,
        hasAllowlist,
        isAllowlisted,
        eligibleAmount: eligibleAmount ? eligibleAmount.toString() : undefined,
        remainingSupply: remainingSupply
          ? remainingSupply.toString()
          : undefined,
        isEligible:
          eligibleAmount !== undefined
            ? BigNumber.from(eligibleAmount).gt(0)
            : undefined,
      };
    },
    [
      contract,
      checkAllowlist,
      config.minterAddress,
      getEligibleAmount,
      getTierRemainingSupply,
    ],
  );
  const refetchTiers = useCallback(async () => {
    setIsLoading(true);
    setError(undefined);

    try {
      if (supportsTieredSales) {
        const fetchedTiers: Record<number, Tier> = {};

        for (let i = 0, l = 10; i < l; i++) {
          const tier = await fetchTierById(i);

          if (
            tier &&
            tier.maxPerWallet &&
            Number(tier.maxPerWallet.toString()) > 0
          ) {
            fetchedTiers[i] = tier;
          } else {
            break;
          }
        }

        setTiers(fetchedTiers);
      } else if (supportsSimpleSales) {
        const past = +new Date() - 100 * 60 * 60 * 1000;
        const future = +new Date() + 100 * 60 * 60 * 1000;
        const preSaleTier: Tier = {
          start: preSaleStatus ? past : future,
          end: future,
          currency: ZERO_BYTES32,
          maxAllocation: Infinity,
          maxPerWallet: preSaleMaxMintPerWallet || Infinity,
          merkleRoot: ZERO_BYTES32,
          hasAllowlist: true,
          price: preSalePrice || 0,
          isSavedOnChain: true,
          reserved: Infinity,
          isActive: preSaleStatus,
          isAllowlisted: preSaleIsAllowlisted,
          isEligible: preSaleStatus && preSaleIsAllowlisted,
          eligibleAmount: preSaleMaxMintPerWallet,
          minterAddress: config.minterAddress,
        };
        const publicSaleTier: Tier = {
          start: publicSaleStatus ? past : future,
          end: future,
          currency: ZERO_BYTES32,
          maxAllocation: Infinity,
          maxPerWallet: publicSaleMaxMintPerTx || Infinity,
          merkleRoot: ZERO_BYTES32,
          hasAllowlist: false,
          price: publicSalePrice || 0,
          isSavedOnChain: true,
          reserved: Infinity,
          isActive: publicSaleStatus,
          isAllowlisted: undefined,
          isEligible: publicSaleStatus,
          eligibleAmount: publicSaleMaxMintPerTx,
          minterAddress: config.minterAddress,
        };

        setTiers({
          0: preSaleTier,
          1: publicSaleTier,
        });
      }
    } catch (error: any) {
      setError(error);
    }

    setIsLoading(false);
  }, [
    supportsTieredSales,
    supportsSimpleSales,
    fetchTierById,
    preSaleStatus,
    preSaleMaxMintPerWallet,
    preSalePrice,
    preSaleIsAllowlisted,
    config.minterAddress,
    publicSaleStatus,
    publicSaleMaxMintPerTx,
    publicSalePrice,
  ]);

  useMemo(() => {
    if (supportsSimpleSalesLoading || supportsTieredSalesLoading) {
      return;
    }

    refetchTiers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    config.minterAddress,
    supportsSimpleSalesLoading,
    supportsTieredSalesLoading,
    preSaleStatus,
    preSaleIsAllowlisted,
    publicSaleStatus,
  ]);

  return {
    data: tiers,
    error:
      // top-level
      error ||
      supportsSimpleSalesError ||
      supportsTieredSalesError ||
      // tiered sales
      allowlistCheckerError ||
      tierSupplyError ||
      eligibleAmountError ||
      // simple sales
      preSaleStatusError ||
      preSaleAllowlistCheckerError ||
      preSaleMaxMintPerWalletError ||
      preSaleMintError ||
      publicSaleMaxMintPerTxError ||
      publicSaleMintError ||
      publicSaleStatusError,
    isLoading:
      // top-level
      isLoading ||
      supportsSimpleSalesLoading ||
      supportsTieredSalesLoading ||
      // tiered sales
      allowlistCheckerLoading ||
      tierSupplyLoading ||
      eligibleAmountLoading ||
      // simple sales
      preSaleStatusLoading ||
      preSaleAllowlistCheckerLoading ||
      preSaleMaxMintPerWalletLoading ||
      preSaleMintLoading ||
      publicSaleMaxMintPerTxLoading ||
      publicSaleMintLoading ||
      publicSaleStatusLoading,
    refetchTiers,
  };
};
