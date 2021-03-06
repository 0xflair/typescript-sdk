import { Environment, useAxiosGet } from '@0xflair/react-common';
import { useLoginJwt } from '@0xflair/react-wallet';
import * as axios from 'axios';
import { useMemo } from 'react';

import { FLAIR_ADDRESS_LISTS_BACKEND } from '../constants';
import { AddressList } from '../types';

type Config = {
  env?: Environment;
  enabled?: boolean;
  listId?: string;
};

export function useAddressList<TListConfig extends Record<string, any>>({
  env = Environment.PROD,
  enabled = true,
  listId,
}: Config) {
  const loginJwt = useLoginJwt();
  const getUrl = `${FLAIR_ADDRESS_LISTS_BACKEND[env]}/v1/address-lists/${listId}`;

  const headers = useMemo(() => {
    return {
      Authorization: `Bearer ${loginJwt}`,
    };
  }, [loginJwt]);

  return useAxiosGet<AddressList<TListConfig>>({
    url: getUrl,
    enabled: Boolean(enabled && loginJwt && listId),
    headers,
  });
}
