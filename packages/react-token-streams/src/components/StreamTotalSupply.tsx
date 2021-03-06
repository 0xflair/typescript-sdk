import { CryptoUnits, CryptoValue } from '@0xflair/react-coingecko';

import { useStreamClaimingContext } from '../providers/StreamClaimingProvider';
import { useStreamContext } from '../providers/StreamProvider';

type Props = {
  className?: string;
};

export const StreamTotalSupply = ({ className }: Props) => {
  const {
    data: { chainInfo },
  } = useStreamContext();
  const {
    data: { currentClaimTokenSymbol, totalSupplyAmountOverall },
  } = useStreamClaimingContext();

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
