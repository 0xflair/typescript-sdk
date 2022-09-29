import { useCollectionContext } from '../providers/CollectionProvider';
import { Media } from './Media';

type Props = {
  loadingMask?: React.ReactNode;
} & React.HTMLAttributes<HTMLImageElement>;

export const CollectionImage = (props: Props) => {
  const {
    data: { collection, collectionMetadata },
    isLoading: { collectionLoading, collectionMetadataLoading },
  } = useCollectionContext();

  return props.loadingMask &&
    (collectionLoading || collectionMetadataLoading) &&
    !collectionMetadata?.image ? (
    <>{props.loadingMask}</>
  ) : (
    <Media
      uri={collectionMetadata?.animation_url || collectionMetadata?.image}
      {...props}
    />
  );
};
