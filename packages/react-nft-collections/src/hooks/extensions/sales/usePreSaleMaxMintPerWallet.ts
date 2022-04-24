import { loadContract, Version } from '@0xflair/contracts-registry';
import { Provider } from '@ethersproject/providers';
import { Signer } from 'ethers';
import { useContractRead } from 'wagmi';

type Config = {
  contractAddress?: string;
  version?: Version;
  signerOrProvider?: Signer | Provider;
  skip?: boolean;
  watch?: boolean;
};

export const usePreSaleMaxMintPerWallet = ({
  contractAddress,
  version,
  signerOrProvider,
  skip,
  watch = false,
}: Config) => {
  const contract = loadContract(
    'collections/ERC721/extensions/ERC721PreSaleExtension',
    version
  );

  const [{ data, error, loading }, preSaleMaxMintPerWalletRead] =
    useContractRead(
      {
        addressOrName: contractAddress as string,
        contractInterface: contract.artifact.abi,
        signerOrProvider,
      },
      'preSaleMaxMintPerWallet',
      {
        skip,
        watch,
      }
    );

  return [
    {
      data,
      error,
      loading,
    },
    preSaleMaxMintPerWalletRead,
  ] as const;
};