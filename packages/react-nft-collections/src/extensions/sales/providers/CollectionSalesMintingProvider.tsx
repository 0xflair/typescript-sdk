import { TransactionResponse } from '@ethersproject/abstract-provider';
import { TransactionReceipt } from '@ethersproject/providers';
import { BigNumber, BigNumberish, BytesLike } from 'ethers';
import * as React from 'react';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

import { useCollectionContext } from '../../../common/providers/CollectionProvider';
import { useSaleMinter } from '../../minting/useSaleMinter';
import { useSaleTiers } from '../hooks/useSaleTiers';
import { Tier } from '../types';

type CollectionSalesMintingContextValue = {
  data: ReturnType<typeof useCollectionContext>['data'] & {
    // On-chain values
    tiers?: Record<number, Tier>;

    // Current tier
    currentTierId?: BigNumberish;
    start?: Date;
    end?: Date;
    price?: BigNumberish;
    hasAllowlist?: boolean;
    isActive?: boolean;
    isAllowlisted?: boolean;
    isEligible?: boolean;
    eligibleAmount?: BigNumberish;

    // Helpers
    canMint?: boolean;
    soldOut?: boolean;
    minterAddress?: BytesLike;

    // Transaction
    txReceipt?: TransactionReceipt;
    txResponse?: TransactionResponse;
  };

  isLoading: ReturnType<typeof useCollectionContext>['isLoading'] & {
    // Resources
    collectionLoading?: boolean;
    collectionMetadataLoading?: boolean;

    // On-chain values
    isAutoDetectingTier?: boolean;
    metadataUriLoading?: boolean;
    maxSupplyLoading?: boolean;
    totalSupplyLoading?: boolean;
    tiersLoading?: boolean;

    // Transaction
    mintLoading?: boolean;
  };

  error: ReturnType<typeof useCollectionContext>['error'] & {
    // Resources
    collectionError?: string | Error | null;
    collectionMetadataError?: string | Error | null;

    // On-chain values
    metadataUriError?: string | Error | null;
    maxSupplyError?: string | Error | null;
    totalSupplyError?: string | Error | null;
    tiersError?: string | Error | null;

    // Transaction
    mintError?: string | Error | null;
  };

  refetchTiers: () => void;
  setCurrentTierId: (currentTierId: BigNumberish) => void;

  mint: (args: {
    mintCount: BigNumberish;
    allowlistProof?: BytesLike[];
  }) => void;
};

export const CollectionSalesMintingContext =
  React.createContext<CollectionSalesMintingContextValue | null>(null);

type FunctionalChildren = (
  contextValue: CollectionSalesMintingContextValue,
) => ReactNode | ReactNode[];

type Props = {
  /** Child elements or a factory function that returns child elements */
  children: FunctionalChildren | ReactNode | ReactNode[];

  defaultTier?: BigNumberish;

  autoDetectEligibleTier?: boolean;

  minterAddress?: BytesLike;

  onMintSuccess?: (args: {
    mintCount: BigNumberish;
    txResponse: TransactionResponse;
    txReceipt: TransactionReceipt;
  }) => void;
};

export const CollectionSalesMintingProvider = ({
  children,
  defaultTier = 0,
  autoDetectEligibleTier = true,
  minterAddress,
  onMintSuccess,
}: Props) => {
  const { data: account } = useAccount();
  const { data, isLoading, error } = useCollectionContext();
  const [currentTierId, setCurrentTierId] = useState<BigNumberish>(
    Number(defaultTier.toString()),
  );
  const [isAutoDetectingTier, setIsAutoDetectingTier] = useState(
    autoDetectEligibleTier,
  );

  const finalMinterAddress = minterAddress || account?.address;

  const {
    data: tiers,
    error: tiersError,
    isLoading: tiersLoading,
    refetchTiers,
  } = useSaleTiers({
    env: data.env,
    chainId: Number(data.chainId),
    contractVersion: data.contractVersion,
    contractAddress: data.contractAddress,
    minterAddress: finalMinterAddress,
  });

  const {
    data: {
      txReceipt,
      txResponse,
      start,
      end,
      price,
      hasAllowlist,
      isActive,
      isAllowlisted,
      isEligible,
      eligibleAmount,
    },
    error: mintError,
    isLoading: mintLoading,
    mint: doMint,
  } = useSaleMinter({
    env: data.env,
    chainId: Number(data.chainId),
    contractVersion: data.contractVersion,
    contractAddress: data.contractAddress,
    tierId: currentTierId,
    minterAddress: finalMinterAddress,
  });

  const soldOut = Boolean(
    data.totalSupply &&
      data.maxSupply &&
      Number(data.totalSupply.toString()) >= Number(data.maxSupply.toString()),
  );

  const canMint = Boolean(
    isActive &&
      isEligible &&
      (!hasAllowlist || isAllowlisted) &&
      !soldOut &&
      !mintLoading,
  );

  useEffect(() => {
    if (!autoDetectEligibleTier && defaultTier !== undefined) {
      if (defaultTier !== currentTierId) {
        setCurrentTierId(defaultTier);
      }
    }
  }, [autoDetectEligibleTier, currentTierId, defaultTier]);

  useEffect(() => {
    if (!autoDetectEligibleTier) {
      setIsAutoDetectingTier(false);
      return;
    }

    const tierIds = Object.keys(tiers || {}).map((id) => Number(id));

    if (!autoDetectEligibleTier || tiersLoading || mintLoading) {
      return;
    }

    if (!tierIds.length) {
      setIsAutoDetectingTier(false);
      return;
    }

    // Find the first tier that is eligible and is active and has remaining supply
    let tierId = tierIds.find((id) => {
      return Boolean(
        tiers[id].isActive &&
          tiers[id].isEligible &&
          (tiers[id].remainingSupply === undefined ||
            BigNumber.from(tiers[id].remainingSupply).gt(0)),
      );
    });

    // If not found, look for a tier that is active and does not have allowlist and has remaining supply
    if (tierId === undefined) {
      tierId = tierIds.find((id) => {
        return Boolean(
          tiers[id].isActive &&
            !tiers[id].hasAllowlist &&
            (tiers[id].remainingSupply === undefined ||
              BigNumber.from(tiers[id].remainingSupply).gt(0)),
        );
      });
    }

    // If not found, look for a tier that is not active but eligible and has remaining supply
    if (tierId === undefined) {
      tierId = tierIds.find((id) => {
        return Boolean(
          tiers[id].isEligible &&
            (tiers[id].remainingSupply === undefined ||
              BigNumber.from(tiers[id].remainingSupply).gt(0)),
        );
      });
    }

    // If not found, look for a tier that is just eligible
    if (tierId === undefined) {
      tierId = tierIds.find((id) => {
        return Boolean(tiers[id].isEligible);
      });
    }

    // If not found, look for a tier that is just active and has remaining supply
    if (tierId === undefined) {
      tierId = tierIds.find((id) => {
        return Boolean(
          tiers[id].isActive &&
            (tiers[id].remainingSupply === undefined ||
              BigNumber.from(tiers[id].remainingSupply).gt(0)),
        );
      });
    }

    // If not found, look for a tier that is just active
    if (tierId === undefined) {
      tierId = tierIds.find((id) => {
        return Boolean(tiers[id].isActive);
      });
    }

    setCurrentTierId(tierId || 0);
    setIsAutoDetectingTier(false);
  }, [
    autoDetectEligibleTier,
    isActive,
    isEligible,
    mintLoading,
    tiers,
    tiersLoading,
  ]);

  const mint = useCallback(
    async (args: { mintCount: BigNumberish }) => {
      const result = await doMint(args);

      if (result) {
        onMintSuccess &&
          onMintSuccess({
            ...args,
            txReceipt: result.receipt,
            txResponse: result.response,
          });
      }

      await refetchTiers();
    },
    [doMint, onMintSuccess, refetchTiers],
  );

  const value = {
    data: {
      // Common
      ...data,

      // On-chain values
      tiers,

      // Current tier
      currentTierId,
      start,
      end,
      price,
      hasAllowlist,
      isActive,
      isAllowlisted,
      eligibleAmount,
      isEligible,

      // Helpers
      canMint,
      soldOut,
      minterAddress: finalMinterAddress,

      // Transaction
      txReceipt,
      txResponse,
    },

    isLoading: {
      // Common
      ...isLoading,

      // Helpers
      isAutoDetectingTier,
      tiersLoading,

      // Transaction
      mintLoading,
    },

    error: {
      // Common
      ...error,

      // Helpers
      tiersError,

      // Transaction
      mintError: mintError as Error,
    },

    refetchTiers,
    setCurrentTierId,
    mint,
  };

  return React.createElement(
    CollectionSalesMintingContext.Provider,
    { value },
    typeof children === 'function' ? children(value) : children,
  );
};

export const useCollectionSalesMintingContext = () => {
  const context = React.useContext(CollectionSalesMintingContext);
  if (!context)
    throw Error('Must be used within <CollectionSalesMintingProvider>');
  return context;
};
