import { CryptoUnits, CryptoValue } from '@0xflair/react-coingecko';
import { classNames } from '@0xflair/react-common';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/solid';
import React, { Fragment } from 'react';
<<<<<<< Updated upstream
import Blockies from 'react-blockies';
import {
  useAccount,
  useBalance,
  useEnsAvatar,
  useEnsName,
  useNetwork,
} from 'wagmi';

import { DisconnectButton } from './DisconnectButton';
=======
import { useCopyToClipboard } from 'react-use';
import { useAccount, useBalance, useNetwork } from 'wagmi';

import { DisconnectButton } from './DisconnectButton';
import { WalletComponentWrapper } from './WalletComponentWrapper';
import { WalletProfile, WalletProfileProps } from './WalletProfile';
>>>>>>> Stashed changes

type Props = {
  className?: string;
  walletProfileProps?: WalletProfileProps;
};

export const WalletDropdown = ({
  className,
  walletProfileProps,
}: Props) => {
  const { activeChain } = useNetwork();
  const { data: account } = useAccount();
  const { data: balance } = useBalance({
    addressOrName: account?.address,
    formatUnits: 'ether',
    watch: false,
  });
<<<<<<< Updated upstream
  const {
    data: avatar,
    error: avatarError,
    isLoading: avatarLoading,
  } = useEnsAvatar({
    addressOrName: account?.address,
    chainId: 1,
  });
  const {
    data: ens,
    error: ensError,
    isLoading: ensLoading,
  } = useEnsName({
    address: account?.address,
    chainId: 1,
  });

  return (
    <Menu
      as="div"
      className={classNames(`relative inline-block`, className || '')}
    >
      <div>
        <Menu.Button className="max-w-xs rounded-full flex gap-2 items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2 lg:rounded-md lg:hover:bg-gray-50">
          {avatar?.toString() ? (
            <img
              className="h-8 w-8 rounded-full"
              src={avatar?.toString()}
              alt=""
=======
  const [, copyToClipboard] = useCopyToClipboard();

  return (
    <WalletComponentWrapper as={as} className={'wallet-dropdown-wrapper'}>
      <Menu
        as="div"
        className={classNames(
          `wallet-dropdown-menu relative inline-block`,
          className || '',
        )}
      >
        <div>
          <Menu.Button className="wallet-dropdown-button max-w-xs rounded-full flex gap-2 items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2 lg:rounded-md lg:hover:bg-gray-50">
            <WalletProfile
              className="flex gap-2 items-center"
              {...walletProfileProps}
            />
            <ChevronDownIcon
              className="wallet-dropdown-icon flex-shrink-0 h-5 w-5 text-gray-400 block"
              aria-hidden="true"
>>>>>>> Stashed changes
            />
          ) : (
            <Blockies
              seed={account?.address?.toLowerCase() || ''}
              size={blockieSize}
              scale={blockieScale}
              className={'rounded-full'}
            />
          )}{' '}
          <span className="hidden text-gray-700 text-sm font-medium lg:block">
            <span className="sr-only">Open wallet menu</span>
            {ens?.toString() ||
              account?.address?.slice(0, 4) +
                '...' +
                account?.address?.slice(-4)}
          </span>
          {balance?.value ? (
            <span className="text-gray-500 truncate">
              {Number(balance.formatted).toFixed(4)}{' '}
              {activeChain?.nativeCurrency?.symbol || balance.symbol}
            </span>
          ) : null}
          <ChevronDownIcon
            className="flex-shrink-0 h-5 w-5 text-gray-400 block"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="origin-top-right absolute z-10 right-0 mt-2 w-auto rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-4 py-3">
            <p className="text-xs capitalize text-gray-400">Wallet Address</p>
            <p className="text-sm font-medium text-gray-900">
              {account?.address}
            </p>
            {balance ? (
              <>
                <p className="text-xs capitalize text-gray-400 mt-3">Balance</p>
                <p className="text-sm font-medium text-gray-900">
                  <CryptoValue
                    symbol={
                      activeChain?.nativeCurrency?.symbol || balance.symbol
                    }
                    unit={CryptoUnits.WEI}
                    value={balance.value}
                  />
                </p>
              </>
            ) : null}
          </div>
          <Menu.Item>
            {({ active }: any) => (
              <a
                href={`https://buy.ramp.network/?userAddress=${account?.address}&defaultAsset=${activeChain?.nativeCurrency?.symbol}`}
                target={'_blank'}
                className={classNames(
                  active ? 'bg-gray-100' : '',
                  'block px-4 py-2 text-sm text-gray-700',
                )}
              >
                Buy {activeChain?.nativeCurrency?.symbol || 'Crypto'}
              </a>
            )}
          </Menu.Item>
          <Menu.Item as={'div'}>
            {({ active }: any) => (
              <DisconnectButton
                className={classNames(
                  active ? 'bg-gray-100' : '',
                  'block px-4 py-2 text-sm text-gray-700 w-full text-left',
                )}
              />
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
