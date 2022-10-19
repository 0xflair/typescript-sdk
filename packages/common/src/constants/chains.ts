import { allChains, Chain } from '@wagmi/core';

// TODO: Move these to wagmi repo itself
// https://github.com/wagmi-dev/wagmi/blob/0.3.x/packages/core/src/constants/chains.ts#L234
const newChains = [
  {
    id: 56,
    name: 'Binance Mainnet',
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
    rpcUrls: {
      default: 'https://bsc-dataseed1.binance.org',
    },
    blockExplorers: {
      etherscan: {
        name: 'BSC Scan',
        url: 'https://testnet.bscscan.com',
      },
      default: {
        name: 'BSC Scan',
        url: 'https://testnet.bscscan.com',
      },
    },
  },
  {
    id: 97,
    name: 'Binance Testnet',
    nativeCurrency: { name: 'tBNB', symbol: 'tBNB', decimals: 18 },
    rpcUrls: {
      default: 'https://data-seed-prebsc-1-s3.binance.org:8545',
    },
    blockExplorers: {
      etherscan: {
        name: 'BSC Scan',
        url: 'https://testnet.bscscan.com',
      },
      default: {
        name: 'BSC Scan',
        url: 'https://testnet.bscscan.com',
      },
    },
    testnet: true,
  },
  {
    id: 66,
    name: 'OKC Mainnet',
    nativeCurrency: { name: 'OKT', symbol: 'OKT', decimals: 18 },
    rpcUrls: {
      default: 'https://exchainrpc.okex.org',
    },
    blockExplorers: {
      etherscan: {
        name: 'OKLink',
        url: 'https://www.oklink.com/en/okc',
      },
      default: {
        name: 'OKLink',
        url: 'https://www.oklink.com/en/okc',
      },
    },
  },
  {
    id: 65,
    name: 'OKC Testnet',
    nativeCurrency: { name: 'OKT', symbol: 'OKT', decimals: 18 },
    rpcUrls: {
      default: 'https://exchaintestrpc.okex.org',
    },
    blockExplorers: {
      etherscan: {
        name: 'OKLink',
        url: 'https://www.oklink.com/en/okc-test',
      },
      default: {
        name: 'OKLink',
        url: 'https://www.oklink.com/en/okc-test',
      },
    },
    testnet: true,
  },
  {
    id: 43_114,
    name: 'Avalanche',
    nativeCurrency: {
      name: 'AVAX',
      symbol: 'AVAX',
      decimals: 18,
    },
    rpcUrls: {
      default: 'https://api.avax.network/ext/bc/C/rpc',
    },
    blockExplorers: {
      etherscan: {
        name: 'Snowtrace',
        url: 'https://snowtrace.io',
      },
      default: {
        name: 'Snowtrace',
        url: 'https://snowtrace.io',
      },
    },
  },
  {
    id: 43_113,
    name: 'Avalanche FUJI',
    nativeCurrency: {
      name: 'AVAX',
      symbol: 'AVAX',
      decimals: 18,
    },
    rpcUrls: {
      default: 'https://api.avax-test.network/ext/bc/C/rpc',
    },
    blockExplorers: {
      etherscan: {
        name: 'Snowtrace',
        url: 'https://testnet.snowtrace.io',
      },
      default: {
        name: 'Snowtrace',
        url: 'https://testnet.snowtrace.io',
      },
    },
    testnet: true,
  },
  {
    id: 250,
    name: 'Fantom',
    nativeCurrency: {
      name: 'FTM',
      symbol: 'FTM',
      decimals: 18,
    },
    rpcUrls: {
      default: 'https://rpc.ankr.com/fantom',
    },
    blockExplorers: {
      etherscan: {
        name: 'FtmScan',
        url: 'https://ftmscan.com',
      },
      default: {
        name: 'FtmScan',
        url: 'https://ftmscan.com',
      },
    },
  },
  {
    id: 4002,
    name: 'Fantom Testnet',
    nativeCurrency: {
      name: 'FTM',
      symbol: 'FTM',
      decimals: 18,
    },
    rpcUrls: {
      default: 'https://rpc.testnet.fantom.network',
    },
    blockExplorers: {
      etherscan: {
        name: 'FtmScan',
        url: 'https://testnet.ftmscan.com',
      },
      default: {
        name: 'FtmScan',
        url: 'https://testnet.ftmscan.com',
      },
    },
    testnet: true,
  },
  {
    id: 1313161554,
    name: 'Near (Aurora)',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: {
      default: 'https://mainnet.aurora.dev',
    },
    blockExplorers: {
      etherscan: {
        name: 'AuroraScan',
        url: 'https://aurorascan.dev',
      },
      default: {
        name: 'AuroraScan',
        url: 'https://aurorascan.dev',
      },
    },
  },
  {
    id: 1313161555,
    name: 'Near (Aurora) Testnet',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: {
      default: 'https://testnet.aurora.dev',
    },
    blockExplorers: {
      etherscan: {
        name: 'AuroraScan',
        url: 'https://testnet.aurorascan.dev',
      },
      default: {
        name: 'AuroraScan',
        url: 'https://testnet.aurorascan.dev',
      },
    },
    testnet: true,
  },
  {
    id: 245022926,
    name: 'Solana (Neon Devnet)',
    nativeCurrency: {
      name: 'NEON',
      symbol: 'NEON',
      decimals: 18,
    },
    rpcUrls: {
      default: 'https://proxy.devnet.neonlabs.org/solana',
    },
    blockExplorers: {
      etherscan: {
        name: 'NeonScan',
        url: 'https://neonscan.org',
      },
      default: {
        name: 'NeonScan',
        url: 'https://neonscan.org',
      },
    },
    testnet: true,
  },
  {
    id: 9000,
    name: 'Evmos Testnet',
    nativeCurrency: {
      name: 'tEVMOS',
      symbol: 'tEVMOS',
      decimals: 18,
    },
    rpcUrls: {
      default: 'https://eth.bd.evmos.dev:8545',
    },
    blockExplorers: {
      etherscan: {
        name: 'Evmos explorer',
        url: 'https://evm.evmos.dev',
      },
      default: {
        name: 'Evmos explorer',
        url: 'https://evm.evmos.dev',
      },
    },
    testnet: true,
  },
  {
    id: 9001,
    name: 'Evmos Mainnet',
    nativeCurrency: {
      name: 'EVMOS',
      symbol: 'EVMOS',
      decimals: 18,
    },
    rpcUrls: {
      default: 'https://eth.bd.evmos.org:8545',
    },
    blockExplorers: {
      etherscan: {
        name: 'Evmos explorer',
        url: 'https://evm.evmos.org',
      },
      default: {
        name: 'Evmos explorer',
        url: 'https://evm.evmos.org',
      },
    },
  },
  {
    id: 1284,
    name: 'Moonbeam',
    nativeCurrency: {
      name: 'GLMR',
      symbol: 'GLMR',
      decimals: 18,
    },
    rpcUrls: {
      default: 'https://rpc.api.moonbeam.network',
    },
    blockExplorers: {
      etherscan: {
        name: 'Moonscan',
        url: 'https://moonscan.io',
      },
      default: {
        name: 'Moonscan',
        url: 'https://moonscan.io',
      },
    },
  },
  {
    id: 1285,
    name: 'Moonriver',
    nativeCurrency: {
      name: 'MOVR',
      symbol: 'MOVR',
      decimals: 18,
    },
    rpcUrls: {
      default: 'https://rpc.api.moonriver.moonbeam.network',
    },
    blockExplorers: {
      etherscan: {
        name: 'Moonscan',
        url: 'https://moonriver.moonscan.io',
      },
      default: {
        name: 'Moonscan',
        url: 'https://moonriver.moonscan.io',
      },
    },
  },
  {
    id: 280,
    name: 'zkSync 2.0 Testnet',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: {
      default: 'https://zksync2-testnet.zksync.dev',
    },
    blockExplorers: {
      etherscan: {
        name: 'zkScan',
        url: 'https://zksync2-testnet.zkscan.io',
      },
      default: {
        name: 'zkScan',
        url: 'https://zksync2-testnet.zkscan.io',
      },
    },
    testnet: true,
  },
  {
    id: 25,
    name: 'Cronos Mainnet',
    nativeCurrency: {
      name: 'CRO',
      symbol: 'CRO',
      decimals: 18,
    },
    rpcUrls: {
      default: 'https://node.croswap.com/rpc',
    },
    blockExplorers: {
      etherscan: {
        name: 'Cronos Chain explorer',
        url: 'https://cronoscan.com',
      },
      default: {
        name: 'Cronos Chain explorer',
        url: 'https://cronoscan.com',
      },
    },
  },
  {
    id: 338,
    name: 'Cronos Testnet',
    nativeCurrency: {
      name: 'TCRO',
      symbol: 'TCRO',
      decimals: 18,
    },
    rpcUrls: {
      default: 'https://evm-t3.cronos.org',
    },
    blockExplorers: {
      etherscan: {
        name: 'Cronos Chain Testnet explorer',
        url: 'https://testnet.cronoscan.com',
      },
      default: {
        name: 'Cronos Chain Testnet explorer',
        url: 'https://testnet.cronoscan.com',
      },
    },
    testnet: true,
  },
  {
    id: 42220,
    name: 'Celo Mainnet',
    nativeCurrency: {
      name: 'CELO',
      symbol: 'CELO',
      decimals: 18,
    },
    rpcUrls: {
      default: 'https://forno.celo.org',
    },
    blockExplorers: {
      etherscan: {
        name: 'Celo explorer',
        url: 'https://explorer.celo.org',
      },
      default: {
        name: 'Celo explorer',
        url: 'https://explorer.celo.org',
      },
    },
  },
  {
    id: 44787,
    name: 'Celo Alfajores Testnet',
    nativeCurrency: {
      name: 'CELO',
      symbol: 'CELO',
      decimals: 18,
    },
    rpcUrls: {
      default: 'https://alfajores-forno.celo-testnet.org',
    },
    blockExplorers: {
      etherscan: {
        name: 'Celo Alfajores Testnet explorer',
        url: 'https://alfajores-blockscout.celo-testnet.org',
      },
      default: {
        name: 'Celo Alfajores Testnet explorer',
        url: 'https://alfajores-blockscout.celo-testnet.org',
      },
    },
    testnet: true,
  },
  {
    id: 42170,
    name: 'Arbitrum Nova',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: {
      default: 'https://nova.arbitrum.io/rpc',
    },
    blockExplorers: {
      etherscan: {
        name: 'Arbitrum Nova explorer',
        url: 'https://nova-explorer.arbitrum.io',
      },
      default: {
        name: 'Arbitrum Nova explorer',
        url: 'https://nova-explorer.arbitrum.io',
      },
    },
  },
  {
    id: 40,
    name: 'Telos',
    nativeCurrency: {
      name: 'TLOS',
      symbol: 'TLOS',
      decimals: 18,
    },
    rpcUrls: {
      default: 'https://mainnet.telos.net/evm',
    },
    blockExplorers: {
      etherscan: {
        name: 'Telos explorer',
        url: 'https://www.teloscan.io',
      },
      default: {
        name: 'Telos explorer',
        url: 'https://www.teloscan.io',
      },
    },
  },
  {
    id: 41,
    name: 'Telos Testnet',
    nativeCurrency: {
      name: 'TLOS',
      symbol: 'TLOS',
      decimals: 18,
    },
    rpcUrls: {
      default: 'https://testnet.telos.net/evm',
    },
    blockExplorers: {
      etherscan: {
        name: 'Telos testnet explorer',
        url: 'https://testnet.teloscan.io',
      },
      default: {
        name: 'Telos testnet explorer',
        url: 'https://testnet.teloscan.io',
      },
    },
    testnet: true,
  },
  {
    id: 42262,
    name: 'Oasis Emerald',
    nativeCurrency: {
      name: 'ROSE',
      symbol: 'ROSE',
      decimals: 18,
    },
    rpcUrls: {
      default: 'https://emerald.oasis.dev',
    },
    blockExplorers: {
      etherscan: {
        name: 'Oasis Emerald explorer',
        url: 'https://explorer.emerald.oasis.dev',
      },
      default: {
        name: 'Oasis Emerald explorer',
        url: 'https://explorer.emerald.oasis.dev',
      },
    },
  },
  {
    id: 42261,
    name: 'Oasis Emerald Testnet',
    nativeCurrency: {
      name: 'ROSE',
      symbol: 'ROSE',
      decimals: 18,
    },
    rpcUrls: {
      default: 'https://testnet.emerald.oasis.dev',
    },
    blockExplorers: {
      etherscan: {
        name: 'Oasis Emerald Testnet explorer',
        url: 'https://testnet.explorer.emerald.oasis.dev',
      },
      default: {
        name: 'Oasis Emerald Testnet explorer',
        url: 'https://testnet.explorer.emerald.oasis.dev',
      },
    },
    testnet: true,
  },
];

const WagmiChains = allChains.filter((c) => ![3, 4, 421611].includes(c.id));

export const FLAIR_CHAINS: Chain[] = [...WagmiChains, ...newChains];

export const FLAIR_DEFAULT_CHAIN = FLAIR_CHAINS.find(
  (c) => c.id === 137 /* polygon */,
) as Chain;

export const FLAIR_CHAIN_MACHINE_NAMES = {
  1: 'mainnet',
  3: 'ropsten',
  4: 'rinkeby',
  5: 'goerli',
  137: 'matic',
  80001: 'mumbai',
};
