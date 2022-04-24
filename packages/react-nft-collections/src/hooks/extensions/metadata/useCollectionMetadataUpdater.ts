import { Environment, ZERO_ADDRESS } from "@0xflair/react-common";
import { useIpfsFileUploader, useIpfsJsonUploader } from "@0xflair/react-ipfs";
import { useCallback } from "react";
import { Version } from "@0xflair/contracts-registry";
import { useCollectionMetadataUriUpdater } from "./useCollectionMetadataUriUpdater";
import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";

export type NftCollectionMetadataUpdates = {
  collectionName?: string;
  collectionSymbol?: string;
  collectionDescription?: string;
  collectionImageFile?: File;
  collectionImageUri?: string;
  additionalMetadataAttributes?: Record<string, any>;
};

type Config = {
  env?: Environment;
  contractAddress?: string;
  version?: Version;
  signerOrProvider?: Signer | Provider;
  metadataUpdates?: NftCollectionMetadataUpdates;
};

export const useCollectionMetadataUpdater = ({
  env = Environment.PROD,
  contractAddress = ZERO_ADDRESS,
  version,
  signerOrProvider,
  metadataUpdates,
}: Config) => {
  const [
    {
      data: setCollectionMetadataUriDate,
      error: setCollectionMetadataUriError,
      loading: setCollectionMetadataUriLoading,
    },
    setCollectionMetadataUri,
  ] = useCollectionMetadataUriUpdater({
    contractAddress,
    signerOrProvider,
    version,
  });

  const [
    {
      data: collectionImageUploaderUri,
      loading: collectionImageUploaderLoading,
      error: collectionImageUploaderError,
    },
    collectionImageUpload,
  ] = useIpfsFileUploader({
    env,
    autoUpload: false,
  });

  const [
    {
      data: collectionMetadataUploaderUri,
      loading: collectionMetadataUploaderLoading,
      error: collectionMetadataUploaderError,
    },
    collectionMetadataUpload,
  ] = useIpfsJsonUploader({
    env,
    autoUpload: false,
  });

  const uploadCollectionMetadata = useCallback(
    async (args?: { metadataUpdates: NftCollectionMetadataUpdates }) => {
      const updates = args?.metadataUpdates || metadataUpdates;

      let collectionImageUri = updates?.collectionImageUri;
      if (updates?.collectionImageFile) {
        collectionImageUri = await collectionImageUpload({
          fromFile: updates?.collectionImageFile,
        });
      }

      const collectionMetadataUri = await collectionMetadataUpload({
        jsonContent: {
          name: updates?.collectionName,
          image: collectionImageUri,
          description: updates?.collectionDescription,
          ...(updates?.additionalMetadataAttributes || {}),
        },
      });

      return { collectionMetadataUri, collectionImageUri };
    },
    [metadataUpdates, collectionImageUpload, collectionMetadataUpload]
  );

  const updateCollectionMetadataUri = useCallback(
    async (args: { collectionMetadataUri?: string }) => {
      if (!args.collectionMetadataUri && !collectionMetadataUploaderUri) return;

      await setCollectionMetadataUri(
        (args.collectionMetadataUri || collectionMetadataUploaderUri) as string
      );
    },
    [collectionMetadataUploaderUri]
  );

  const uploadAndUpdateCollectionMetadata = useCallback(async () => {
    const { collectionImageUri, collectionMetadataUri } =
      await uploadCollectionMetadata();

    await updateCollectionMetadataUri({
      collectionMetadataUri,
    });

    return { collectionImageUri, collectionMetadataUri };
  }, [uploadCollectionMetadata, updateCollectionMetadataUri]);

  return [
    {
      data: {
        collectionImageUploaderUri,
        collectionMetadataUploaderUri,
        ...setCollectionMetadataUriDate,
      },
      error:
        setCollectionMetadataUriError ||
        collectionImageUploaderError ||
        collectionMetadataUploaderError,
      loading:
        setCollectionMetadataUriLoading ||
        collectionImageUploaderLoading ||
        collectionMetadataUploaderLoading,
    },
    uploadAndUpdateCollectionMetadata,
  ] as const;
};
