import { providers } from 'ethers';
import { ReactNode, useCallback, useMemo } from 'react';
import { createClient, Provider } from 'wagmi';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

import { MagicLinkConnector } from '../connectors/magic-link';
import {
  FLAIR_CHAINS,
  FLAIR_DEFAULT_CHAIN,
  FLAIR_INFURA_PROJECT_ID,
} from '../constants';

type Props = {
  children?: ReactNode;
  appName?: string;
  infuraId?: string;
  custodialWallet?: boolean;
  wagmiOverrides?: Record<string, any>;
};

const FLAIR_MAGIC_API_KEY = 'pk_live_8B82089A89462668';

export const WalletProvider = ({
  children,
  appName = 'Flair',
  infuraId = FLAIR_INFURA_PROJECT_ID,
  custodialWallet = false,
  wagmiOverrides,
}: Props) => {
  const provider = useCallback(
    (config: { chainId?: number }) => {
      try {
        return new providers.InfuraProvider(config.chainId, infuraId);
      } catch (e) {
        try {
          return providers.getDefaultProvider(config.chainId);
        } catch (e) {
          try {
            return new providers.Web3Provider(
              window.ethereum as any,
              Number(config.chainId)
            );
          } catch (e) {
            return providers.getDefaultProvider();
          }
        }
      }
    },
    [infuraId]
  );

  const connectors = useCallback(
    ({ chainId }: any) => {
      const rpcUrl =
        FLAIR_CHAINS.find((x) => x.id === chainId)?.rpcUrls.default ??
        FLAIR_DEFAULT_CHAIN.rpcUrls.default;

      const connectors: any[] = [
        new InjectedConnector({
          chains: FLAIR_CHAINS,
          options: { shimDisconnect: true },
        }),
        new WalletConnectConnector({
          chains: FLAIR_CHAINS,
          options: {
            infuraId,
            qrcode: true,
          },
        }),
        new CoinbaseWalletConnector({
          chains: FLAIR_CHAINS,
          options: {
            appName,
            jsonRpcUrl: `${rpcUrl}/${infuraId}`,
          },
        }),
      ];

      if (custodialWallet) {
        connectors.push(
          // new MagicConnector({
          //   chains: FLAIR_CHAINS,
          //   options: {
          //     apiKey: FLAIR_MAGIC_API_KEY,
          //     oauthOptions: {
          //       providers: ['google', 'twitter', 'github'],
          //     },
          //     customHeaderText: appName,
          //     additionalMagicOptions: {},
          //   },
          // }),
          new MagicLinkConnector({
            chains: FLAIR_CHAINS,
            options: {
              apiKey: FLAIR_MAGIC_API_KEY,
              oauthOptions: {
                providers: ['google', 'twitter', 'github'],
              },
              customHeaderText: appName,
            },
          })
        );
      }

      return connectors;
    },
    [appName, custodialWallet, infuraId]
  );

  const client = useMemo(
    () =>
      createClient({
        autoConnect: true,
        connectors,
        provider,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [appName, infuraId]
  );

  return (
    <Provider client={client} {...wagmiOverrides}>
      {children}
    </Provider>
  );
};
