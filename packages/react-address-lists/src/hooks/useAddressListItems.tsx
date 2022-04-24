import { Environment, useAxiosGet } from "@0xflair/react-common";
import { useLoginJwt } from "@0xflair/react-wallet";
import { FLAIR_ADDRESS_LISTS_BACKEND } from "../constants";
import { AddressListItem } from "../types";

type Config = {
  listId?: string;
  skip?: boolean;
  env?: Environment;
};

export function useAddressListItems({
  listId,
  env = Environment.PROD,
}: Config) {
  const loginJwt = useLoginJwt();

  const url = `${FLAIR_ADDRESS_LISTS_BACKEND[env]}/v1/address-lists/${listId}/items`;
  const [{ data, loading, error }, sendRequest] = useAxiosGet<
    AddressListItem[]
  >({
    url,
    skip: false,
    headers: {
      Authorization: `Bearer ${loginJwt}`,
    },
  });

  return [{ data, loading, error }, sendRequest] as const;
}
