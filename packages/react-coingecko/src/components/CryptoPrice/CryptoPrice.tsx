import * as ethers from 'ethers';
import { BigNumberish } from 'ethers';

import { useCryptoCurrency, useCryptoPrice } from '../../hooks';
import { CryptoSymbol, CryptoUnits } from '../../types';

type Props = {
  value?: string | BigNumberish;
  fractionDigits?: number;
  unit?: CryptoUnits;
  symbol?: CryptoSymbol;
};

export const CryptoPrice = (props: Props) => {
  const {
    value = '1',
    fractionDigits = 2,
    unit = CryptoUnits.ETHER,
    symbol = 'ETH',
  } = props;

  const { data, error, loading } = useCryptoCurrency({
    symbol,
  });

  const valueBn = ethers.utils.parseUnits(value?.toString() || '0', unit);
  const etherValue = ethers.utils.formatUnits(valueBn, CryptoUnits.ETHER);

  return (
    <>{(Number(etherValue) * Number(data.price)).toFixed(fractionDigits)}</>
  );
};
