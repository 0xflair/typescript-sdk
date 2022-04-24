import { Version } from '@0xflair/contracts-registry';
import { Environment } from '@0xflair/react-common';
import { useIpfsFileUploader, useIpfsJsonUploader } from '@0xflair/react-ipfs';
import { Dispatch, SetStateAction, useCallback, useEffect } from 'react';

export type NftTokenMetadataUpdaterState = {
  name?: string;
  description?: string;
  imageFile?: File;
  imageUrl?: string;
  metadataUrl?: string;
  additionalMetadataAttributes?: Record<string, any>;
};

type Config = {
  env?: Environment;
  contractAddress?: string;
  version?: Version;
  metadataState?: NftTokenMetadataUpdaterState;
  setMetadataState?: Dispatch<SetStateAction<NftTokenMetadataUpdaterState>>;
};

export const useIpfsNftTokenMetadataUploader = ({
  env = Environment.PROD,
  metadataState,
  setMetadataState,
}: Config) => {
  const [
    {
      data: imageUploaderUrl,
      loading: imageUploaderLoading,
      error: imageUploaderError,
    },
    uploadImage,
  ] = useIpfsFileUploader({
    env,
    autoUpload: false,
  });

  const [
    {
      data: metadataUploaderUrl,
      loading: metadataUploaderLoading,
      error: metadataUploaderError,
    },
    uploadMetadata,
  ] = useIpfsJsonUploader({
    env,
    autoUpload: false,
  });

  const uploadNftTokenMetadata = useCallback(async () => {
    let imageUrl = metadataState?.imageUrl;
    if (metadataState?.imageFile) {
      imageUrl = await uploadImage({
        fromFile: metadataState?.imageFile,
      });
    }
    if (!imageUrl) return;

    const metadataUrl = await uploadMetadata({
      jsonContent: {
        name: metadataState?.name,
        image: imageUrl,
        description: metadataState?.description,
        ...(metadataState?.additionalMetadataAttributes || {}),
      },
    });

    return metadataUrl;
  }, [metadataState, uploadImage, uploadMetadata]);

  // Update the state when image and/or metadata is uploaded
  useEffect(() => {
    if (!setMetadataState) {
      return;
    }

    if (
      imageUploaderUrl === metadataState?.imageUrl &&
      metadataUploaderUrl === metadataState?.metadataUrl
    ) {
      return;
    }

    setMetadataState((e) => ({
      ...(e || {}),
      imageUrl: imageUploaderUrl,
      metadataUrl: metadataUploaderUrl,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setMetadataState, imageUploaderUrl, metadataUploaderUrl]);

  return [
    {
      data: {
        imageUploaderUrl,
        metadataUploaderUrl,
      },
      error: {
        imageUploaderError,
        metadataUploaderError,
      },
      loading: {
        imageUploaderLoading,
        metadataUploaderLoading,
      },
    },
    uploadNftTokenMetadata,
  ] as const;
};
