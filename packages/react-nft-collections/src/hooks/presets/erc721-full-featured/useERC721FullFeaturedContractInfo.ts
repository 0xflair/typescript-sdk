import { loadContract, Version } from '@0xflair/contracts-registry';
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

export type ERC721FullFeaturedContractInfo = [
  collectionName: string,
  collectionSymbol: string,
  collectionMetadataUri: string,
  placeholderMetadataUri: string,
  maxSupply: number,
  preSalePrice: number,
  preSaleMaxPerWallet: number,
  publicSalePrice: number,
  maxMintPerTx: number,
];

export const useERC721FullFeaturedContractInfo = <Contract = any>({
  contractAddress,
  version,
  signerOrProvider,
  watch,
}: Config) => {
  const contract = loadContract(
    'collections/ERC721/presets/ERC721FullFeaturedCollection',
    version,
  );

  return useContractRead(
    {
      addressOrName: contractAddress as string,
      contractInterface: contract.artifact.abi,
      signerOrProvider,
    },
    'getInfo',
    {
      skip: !contractAddress,
      watch,
    },
  );
};
