import { BigNumberish, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { useContractWrite, useWaitForTransaction } from 'wagmi';
import { useCallback } from 'react';
import { Version, loadContract } from '@0xflair/contracts-registry';

type Config = {
  contractAddress?: string;
  version?: Version;
  signerOrProvider?: Signer | Provider;
};

export const usePreSaleMaxMintPerWalletUpdater = ({
  contractAddress,
  version,
  signerOrProvider,
}: Config) => {
  const contract = loadContract(
    'collections/ERC721/extensions/ERC721PreSaleExtension',
    version,
  );

  const [
    {
      data: responseData,
      error: responseError,
      loading: responseLoading,
    },
    setPreSaleMaxMintPerWalletWrite,
  ] = useContractWrite(
    {
      addressOrName: contractAddress as string,
      contractInterface: contract.artifact.abi,
      signerOrProvider,
    },
    'setPreSaleMaxMintPerWallet',
  );

  const [
    {
      data: receiptData,
      error: receiptError,
      loading: receiptLoading,
    },
  ] = useWaitForTransaction({
    hash: responseData?.hash,
    confirmations: 2,
  });

  const setPreSaleMaxMintPerWallet = useCallback(
    async (newValue: BigNumberish) => {
      const response = await setPreSaleMaxMintPerWalletWrite({
        args: [newValue],
      });

      const receipt = await response.data?.wait(1);

      return { response, receipt };
    },
    [setPreSaleMaxMintPerWalletWrite],
  );

  return [
    {
      data: {
        txResponse: responseData,
        txReceipt: receiptData,
      },
      error: responseError || receiptError,
      loading: responseLoading || receiptLoading,
    },
    setPreSaleMaxMintPerWallet,
  ] as const;
};
