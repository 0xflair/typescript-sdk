export type SupportedOpenSeaChains = keyof typeof FLAIR_OPENSEA_ADDRESSES;

export const FLAIR_OPENSEA_ADDRESSES = {
  1: {
    registryAddress: '0x1E0049783F008A0085193E00003D00cd54003c71', // <- SeaPort, old Wyvern: 0xa5409ec958c83c3f309868babaca7c86dcb077c1
    exchangeAddress: '0x0000000000000000000000000000000000000000',
  },
  4: {
    registryAddress: '0xF57B2c51dED3A29e6891aba85459d600256Cf317',
    exchangeAddress: '0x0000000000000000000000000000000000000000',
  },
  137: {
    registryAddress: '0x0000000000000000000000000000000000000000',
    exchangeAddress: '0x58807baD0B376efc12F5AD86aAc70E78ed67deaE',
  },
  80001: {
    registryAddress: '0x0000000000000000000000000000000000000000',
    exchangeAddress: '0x2545943C4d9f6F4A617cEAbA91bd13eD37DeF1aD',
  },
};
