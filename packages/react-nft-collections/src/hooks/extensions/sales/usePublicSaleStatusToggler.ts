import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import { useContractWrite, useWaitForTransaction } from "wagmi";
import { useCallback } from "react";
import { Version, loadContract } from "@0xflair/contracts-registry";

type Config = {
  contractAddress?: string;
  version?: Version;
  signerOrProvider?: Signer | Provider;
};

export const usePublicSaleStatusToggler = ({
  contractAddress,
  version,
  signerOrProvider,
}: Config) => {
  const contract = loadContract(
    "collections/ERC721/extensions/ERC721PublicSaleExtension",
    version
  );

  const [
    { data: responseData, error: responseError, loading: responseLoading },
    togglePublicSaleStatusWrite,
  ] = useContractWrite(
    {
      addressOrName: contractAddress as string,
      contractInterface: contract.artifact.abi,
      signerOrProvider,
    },
    "togglePublicSaleStatus"
  );

  const [{ data: receiptData, error: receiptError, loading: receiptLoading }] =
    useWaitForTransaction({
      hash: responseData?.hash,
      confirmations: 2,
    });

  const togglePublicSaleStatus = useCallback(
    async (newValue: boolean) => {
      const response = await togglePublicSaleStatusWrite({
        args: [newValue],
      });

      const receipt = await response.data?.wait(1);

      return { response, receipt };
    },
    [togglePublicSaleStatusWrite]
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
    togglePublicSaleStatus,
  ] as const;
};
