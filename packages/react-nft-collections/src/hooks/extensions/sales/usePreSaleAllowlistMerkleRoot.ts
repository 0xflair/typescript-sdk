import { Version, loadContract } from '@0xflair/contracts-registry';
import { Signer } from 'ethers';
import { useContractRead } from 'wagmi';
import { Provider } from '@ethersproject/providers';

type Config = {
  contractAddress?: string;
  version?: Version;
  signerOrProvider?: Signer | Provider;
  skip?: boolean;
  watch?: boolean;
};

export const usePreSaleAllowlistMerkleRoot = ({
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

  const [{ data, error, loading }, preSaleAllowlistMerkleRootRead] = useContractRead(
    {
      addressOrName: contractAddress as string,
      contractInterface: contract.artifact.abi,
      signerOrProvider,
    },
    'preSaleAllowlistMerkleRoot',
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
    preSaleAllowlistMerkleRootRead,
  ] as const;
};
