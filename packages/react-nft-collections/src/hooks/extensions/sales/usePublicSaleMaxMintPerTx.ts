import { Signer } from 'ethers';
import { useContractRead } from 'wagmi';
import { Version, loadContract } from '@0xflair/contracts-registry';
import { Provider } from '@ethersproject/providers';

type Config = {
  contractAddress?: string;
  version?: Version;
  signerOrProvider?: Signer | Provider;
  skip?: boolean;
  watch?: boolean;
};

export const usePublicSaleMaxMintPerTx = ({
  contractAddress,
  version,
  signerOrProvider,
  skip,
  watch = false,
}: Config) => {
  const contract = loadContract(
    'collections/ERC721/extensions/ERC721PreSaleExtension',
    version,
  );

  const [{ data, error, loading }, publicSaleMaxMintPerTxRead] = useContractRead(
    {
      addressOrName: contractAddress as string,
      contractInterface: contract.artifact.abi,
      signerOrProvider,
    },
    'publicSaleMaxMintPerTx',
    {
      skip,
      watch,
    },
  );

  return [
    {
      data,
      error,
      loading,
    },
    publicSaleMaxMintPerTxRead,
  ] as const;
};
