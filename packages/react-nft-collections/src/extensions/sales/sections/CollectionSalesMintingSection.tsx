import { ContractVersion } from '@0xflair/contracts-registry';
import { Environment } from '@0xflair/react-common';
import {
  ConnectButton,
  SwitchChainButton,
  WalletDropdown,
} from '@0xflair/react-wallet';
import { BigNumberish } from 'ethers';
import { useState } from 'react';
import { useAccount } from 'wagmi';

import { CollectionImage } from '../../../common/components/CollectionImage';
import { CollectionSupplyCounter } from '../../../common/components/CollectionSupplyCounter';
import { CollectionTitle } from '../../../common/components/CollectionTitle';
import { CollectionProvider } from '../../../common/providers/CollectionProvider';
import {
  CollectionSalesMintButton,
  CollectionSalesMintInput,
} from '../components';
import { CollectionSalesActiveStatus } from '../components/CollectionSalesActiveStatus';
import { CollectionSalesAllowlistStatus } from '../components/CollectionSalesAllowlistStatus';
import { CollectionSalesMintStatusBar } from '../components/CollectionSalesMintStatusBar';
import { CollectionSalesPrice } from '../components/CollectionSalesPrice';
import { CollectionSalesMintingProvider } from '../providers';

type Props = {
  env?: Environment;
  chainId: number;
  contractAddress: string;
  contractVersion?: ContractVersion;
};

export const CollectionSalesMintingSection = ({
  env = Environment.PROD,
  chainId,
  contractAddress,
  contractVersion,
}: Props) => {
  const { data: account } = useAccount();
  const [mintCount, setMintCount] = useState<BigNumberish>('1');

  const mintButtonClass =
    'w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <CollectionProvider
      env={env}
      chainId={Number(chainId)}
      contractAddress={contractAddress}
      contractVersion={contractVersion}
    >
      <CollectionSalesMintingProvider>
        {({
          data: {
            collection,
            collectionMetadata,
            preSaleStatus,
            publicSaleStatus,
          },
          mint,
        }) => (
          <>
            <main className="h-fit max-w-2xl mx-auto lg:max-w-5xl flex items-center p-4">
              <div className="min-w-full lg:grid lg:grid-cols-12 lg:auto-rows-min lg:gap-x-8">
                <div className="lg:col-start-6 lg:col-span-7">
                  {/* Sales Info */}
                  <div className="flex gap-4 sm:items-center sm:justify-between sm:flex-row flex-col">
                    <CollectionTitle className="text-4xl font-medium text-gray-900" />
                    <CollectionSalesPrice className="text-xl font-medium text-gray-900" />
                  </div>

                  {/* Sale Status */}
                  <div className="mt-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <CollectionSupplyCounter className="text-sm text-gray-700" />

                      <CollectionSalesActiveStatus />

                      {account && preSaleStatus && !publicSaleStatus && (
                        <CollectionSalesAllowlistStatus />
                      )}
                    </div>
                  </div>
                </div>

                {/* Image */}
                <div className="mt-8 lg:mt-0 lg:col-start-1 lg:col-span-5 lg:row-start-1 lg:row-span-3">
                  <div className="flex items-center justify-center overflow-hidden rounded-lg">
                    <CollectionImage className="lg:col-span-2 lg:row-span-2 overflow-hidden rounded-lg w-full" />
                  </div>
                </div>

                <div className="mt-4 lg:col-span-7">
                  <form
                    onSubmit={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                  >
                    {/* Mint count */}
                    <div className="mt-8 mb-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-sm font-medium text-gray-900">
                          How many to mint?
                        </h2>
                      </div>

                      <fieldset className="mt-4">
                        <legend className="sr-only">
                          Choose number of mints
                        </legend>
                        <div className="flex">
                          <CollectionSalesMintInput
                            mintCount={mintCount}
                            setMintCount={setMintCount}
                            className="appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-75"
                          />
                        </div>
                      </fieldset>
                    </div>

                    {/* Mint button */}
                    <ConnectButton className={mintButtonClass}>
                      <div className="flex gap-3 items-center">
                        <SwitchChainButton
                          requiredChainId={Number(chainId)}
                          className={mintButtonClass}
                        >
                          <CollectionSalesMintButton
                            mintCount={mintCount}
                            className={mintButtonClass}
                          />
                        </SwitchChainButton>
                        <WalletDropdown />
                      </div>
                    </ConnectButton>
                  </form>

                  <CollectionSalesMintStatusBar className="mt-4 flex flex-col gap-2" />

                  {/* Description */}
                  {collectionMetadata?.description ||
                  collection?.config?.collectionDescription ? (
                    <div className="mt-10">
                      <h2 className="mt-8 text-sm font-medium text-gray-900">
                        Description
                      </h2>

                      <div className="mt-3 prose prose-sm text-gray-500">
                        {collectionMetadata?.description ||
                          collection?.config?.collectionDescription}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </main>
          </>
        )}
      </CollectionSalesMintingProvider>
    </CollectionProvider>
  );
};
