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

export const usePreSaleStatus = ({
  contractAddress,
  version,
  signerOrProvider,
  skip,
  watch = true,
}: Config) => {
  const contract = loadContract(
    'collections/ERC721/extensions/ERC721PreSaleExtension',
    version,
  );

  const [{ data, error, loading }, preSaleStatusRead] = useContractRead(
    {
      addressOrName: contractAddress as string,
      contractInterface: contract.artifact.abi,
      signerOrProvider,
    },
    'preSaleStatus',
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
    preSaleStatusRead,
  ] as const;
};
