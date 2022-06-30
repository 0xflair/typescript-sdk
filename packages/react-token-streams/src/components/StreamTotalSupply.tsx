import { CryptoUnits, CryptoValue } from '@0xflair/react-coingecko';
import { useChainId, useChainInfo } from 'flair-sdk';

import { useStreamClaimingContext } from '../providers/StreamClaimingProvider';

type Props = {
  className?: string;
};

export const StreamTotalSupply = ({ className }: Props) => {
  const {
    data: { stream, currentClaimTokenSymbol, totalSupplyAmountOverall },
  } = useStreamClaimingContext();
  const chainInfo = useChainInfo(stream?.chainId);

  return (
    <div className={className}>
      <CryptoValue
        symbol={
          currentClaimTokenSymbol?.toString() ||
          chainInfo?.nativeCurrency?.symbol
        }
        value={totalSupplyAmountOverall}
        unit={CryptoUnits.WEI}
        showPrice={false}
      />
    </div>
  );
};
