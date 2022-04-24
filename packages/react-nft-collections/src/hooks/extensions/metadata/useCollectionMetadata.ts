import { Signer } from 'ethers';
import { useCollectionMetadataUri } from './useCollectionMetadataUri';
import { Provider } from '@ethersproject/providers';
import { Version } from '@0xflair/contracts-registry';
import { useRemoteJsonReader } from '@0xflair/react-ipfs';
import { NftCollectionMetadata } from '../../../types';

type Config = {
  contractAddress?: string;
  version?: Version;
  signerOrProvider?: Signer | Provider;
  skip?: boolean;
  watch?: boolean;
};

export const useCollectionMetadata = ({
  contractAddress,
  version,
  signerOrProvider,
  skip,
  watch,
}: Config) => {
  const [
    {
      data: contractURI,
      error: contractURIError,
      loading: contractURILoading,
    },
    contractURIRead,
  ] = useCollectionMetadataUri({
    contractAddress,
    version,
    signerOrProvider,
    skip,
    watch,
  });

  const [
    {
      data: collectionMetadata,
      error: collectionMetadataError,
      loading: collectionMetadataLoading,
    },
    fetchContractMetadata,
  ] = useRemoteJsonReader<NftCollectionMetadata>({
    uri: contractURI,
    skip: true,
  });

  return [
    {
      data: collectionMetadata,
      error: !collectionMetadata ? collectionMetadataError || contractURIError : undefined,
      loading: collectionMetadataLoading || contractURILoading,
    },
    contractURIRead,
  ] as const;
};
