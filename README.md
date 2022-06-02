# Flair Typescript SDK

A complete suite of Flair reusable components and clients for frontend and backend development.

## React

These components and hooks are for [React](https://reactjs.org/) framework to easily build a web3 dApp and optionally integrate with Flair ecosystem.

| Package                 | Description                                                                                                                           | Links                                      |
| :---------------------- | :------------------------------------------------------------------------------------------------------------------------------------ | :----------------------------------------- |
| `flair-sdk`             | This package exports all components below for convenience. If you import this package you don't need to import any of packages below. | -                                          |
| `/react-common`          | Commonly used React hooks and components such as deploying a contract, getting chain information, Axios hooks, etc.                   | [README](./packages/react-common)          |
| `/react-wallet`          | Ready-made drop-in wallet-related components and hooks, such as Connect button, Network switcher, Web3 provider, etc.                 | [README](./packages/react-wallet)          |
| `/react-nft-collections` | React hooks and components to create, manage, mint and read ERC721 NFT collections.                                                   | [README](./packages/react-nft-collections) |
| `/react-nft-tokens`      | React hooks to retrieve NFT tokens of a specific wallet or collection.                                                                | [README](./packages/react-nft-tokens)      |
| `/react-token-streams`   | React hooks and components to create token streams such as staking pools or airdropped rewards based on NFTs.                         | [README](./packages/react-token-streams)   |
| `/react-address-lists`   | React hooks and components to create and manage, and generate merkle trees for address lists. Useful for mintlists, allowlists etc.   | [README](./packages/react-address-lists)   |
| `/react-coingecko`       | React components and hooks to work with crypto prices both as input or for display.                                                   | [README](./packages/react-coingecko)       |
| `/react-openzeppelin`    | React hooks built to interact with OpenZeppelin contracts.                                                                            | [README](./packages/react-openzeppelin)    |
| `/react-ipfs`            | Easy to use react hooks for working with IPFS such as uploading.                                                                      | [README](./packages/react-ipfs)            |
| `/react-ui`              | Tailwind and React components and hooks that helps building a web3 dApp dashboard.                                                    | [README](./packages/react-ui)              |

## Documentation

Visit [docs.flair.finance](https://docs.flair.finance) for the full SDK documentation.

## Development

This repository is equipped with [Storybook](https://storybook.js.org/) for ease of development and manual testing.

1. Clone this repo:

   ```sh
   git clone https://github.com/0xflair/typescript-sdk.git
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Start the Storybook:

   ```sh
   npm start
   ```
