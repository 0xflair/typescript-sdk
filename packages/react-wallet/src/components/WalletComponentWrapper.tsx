import { classNames } from '@0xflair/react-common';
import { PropsWithChildren } from 'react';

export const WalletComponentWrapper = ({
  children,
  className,
}: PropsWithChildren & { className: string }) => {
  return (
    <span className={classNames('flair-wallet-component', className)}>
      {children}
    </span>
  );
};
