import { loadContract, Version } from '@0xflair/contracts-registry';
import { BigNumber, Signer } from 'ethers';
import { useContractRead } from 'wagmi';
import { Provider } from '@ethersproject/providers';

type Config = {
  contractAddress?: string;
  version?: Version;
  signerOrProvider?: Signer | Provider;
  skip?: boolean;
  watch?: boolean;
};

export const usePublicSaleStatus = ({
  contractAddress,
  version,
  signerOrProvider,
  skip,
  watch = true,
}: Config) => {
  const contract = loadContract(
    'collections/ERC721/extensions/ERC721PublicSaleExtension',
    version,
  );

  const [{ data, error, loading }, publicSaleStatusRead] = useContractRead(
    {
      addressOrName: contractAddress as string,
      contractInterface: contract.artifact.abi,
      signerOrProvider,
    },
    'publicSaleStatus',
    {
      skip,
      watch,
    },
  );

  return [
    {
      data: data ? BigNumber.from(data) : undefined,
      error,
      loading,
    },
    publicSaleStatusRead,
  ] as const;
};
