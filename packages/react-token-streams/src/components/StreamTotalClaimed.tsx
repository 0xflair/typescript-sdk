import { CryptoUnits, CryptoValue } from '@0xflair/react-coingecko';
import { useChainId, useChainInfo } from 'flair-sdk';
import stream from 'stream';

import { useStreamClaimingContext } from '../providers/StreamClaimingProvider';

type Props = {
  className?: string;
  calculationMode?: 'BY_ACCOUNT' | 'OVERALL';
};

export const StreamTotalClaimed = ({
  className,
  calculationMode = 'BY_ACCOUNT',
}: Props) => {
  const {
    data: {
      stream,
      totalClaimedAmountByAccount,
      totalClaimedAmountOverall,
      currentClaimTokenSymbol,
    },
  } = useStreamClaimingContext();
  const chainInfo = useChainInfo(stream?.chainId);

  return (
    <div className={className}>
      <CryptoValue
        symbol={
          currentClaimTokenSymbol?.toString() ||
          chainInfo?.nativeCurrency?.symbol
        }
        value={
          calculationMode === 'BY_ACCOUNT'
            ? totalClaimedAmountByAccount
            : totalClaimedAmountOverall
        }
        unit={CryptoUnits.WEI}
        showPrice={false}
      />
    </div>
  );
};
