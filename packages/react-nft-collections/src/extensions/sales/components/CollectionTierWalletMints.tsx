import { Fragment } from 'react';

import { useCollectionContext } from '../../../common/providers/CollectionProvider';
import { useTierSaleWalletMints } from '../hooks/useTierSaleWalletMints';
import { useCollectionSalesMintingContext } from '../providers/CollectionSalesMintingProvider';
import { BareComponentProps } from '../types';

type Props = BareComponentProps & {
  loadingMask?: React.ReactNode;
  tierId?: number;
};

export const CollectionTierWalletMints = ({
  as = Fragment,
  loadingMask = '...',
  tierId,
  ...attributes
}: Props) => {
  const {
    data: { chainId, contractAddress, contractVersion },
  } = useCollectionContext();

  const {
    data: { currentTierId },
  } = useCollectionSalesMintingContext();

  const { data, isLoading } = useTierSaleWalletMints({
    chainId,
    contractAddress,
    contractVersion,
    tierId: tierId || currentTierId,
  });

  const Component = as;

  return (
    <Component {...attributes}>
      {loadingMask && isLoading && data === undefined ? (
        <>{loadingMask}</>
      ) : (
        data?.toLocaleString()
      )}
    </Component>
  );
};
