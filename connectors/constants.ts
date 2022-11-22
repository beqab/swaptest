import connector from '../utils/connector';

export const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID;

export enum SupportedChainId {
  BSC_TESTNET = 97,
  BSC_MAINNET = 56,
}
export const LIST_BSC_TESTNET = [
  'https://data-seed-prebsc-1-s1.binance.org:8545/',
  'https://data-seed-prebsc-2-s1.binance.org:8545/',
  'https://data-seed-prebsc-1-s2.binance.org:8545/',
  'https://data-seed-prebsc-2-s2.binance.org:8545/',
  'https://data-seed-prebsc-1-s3.binance.org:8545/',
  'https://data-seed-prebsc-2-s3.binance.org:8545/',
];

export const LIST_BSC_MAINNET = [
  'https://bsc-dataseed.binance.org/',
  'https://bsc-dataseed1.defibit.io/',
  'https://bsc-dataseed1.ninicoin.io/',
  'https://bscrpc.com',
];
export const BRIDGE_WALLET_CONNECT_URL =
  'https://pancakeswap.bridge.walletconnect.org';

export const METAMASK = 'metamask';
export const WALLET_CONNECT = 'walletconnect';

export const LIST_NETWORK_RPC_TESTNET: any = {
  [SupportedChainId.BSC_TESTNET]: connector.randomRPC(LIST_BSC_TESTNET),
};
export const LIST_NETWORK_RPC_MAINNET: any = {
  [SupportedChainId.BSC_MAINNET]: connector.randomRPC(LIST_BSC_MAINNET),
};

export const BASE_SCAN_URLS = {
  [SupportedChainId.BSC_MAINNET]: 'https://bscscan.com',
  [SupportedChainId.BSC_TESTNET]: 'https://testnet.bscscan.com',
};

export const NETWORK_CONFIG = {
  [SupportedChainId.BSC_TESTNET]: {
    name: 'BSC TESTNET',
    scanURL: BASE_SCAN_URLS[SupportedChainId.BSC_TESTNET],
  },
  [SupportedChainId.BSC_MAINNET]: {
    name: 'BSC MAINNET',
    scanURL: BASE_SCAN_URLS[SupportedChainId.BSC_MAINNET],
  },
};

export interface NetworkInfo {
  name: string;
  id?: string | undefined;
  currency?: string;
  [k: string]: any;
}

export const APP_NETWORKS_SUPPORT: { [key: number]: NetworkInfo } = {
  [SupportedChainId.BSC_TESTNET]: {
    name: 'BSC TESTNET',
    id: SupportedChainId.BSC_TESTNET?.toString(),
    currency: 'BNB',
    networkName: 'BSC TESTNET',
    details: {
      chainId: `0x${(+SupportedChainId.BSC_TESTNET.toString()).toString(16)}`,
      chainName: 'BSC TESTNET',
      nativeCurrency: {
        name: 'BNB',
        symbol: 'BNB',
        decimals: 18,
      },
      rpcUrls: LIST_BSC_TESTNET,
      blockExplorerUrls: ['https://testnet.bscscan.com'],
    },
  },
  [SupportedChainId.BSC_MAINNET]: {
    name: 'BSC Mainnet',
    id: SupportedChainId.BSC_MAINNET?.toString(),
    currency: 'BNB',
    networkName: 'BSC Mainnet',
    details: {
      chainId: `0x${(+SupportedChainId.BSC_MAINNET).toString(16)}`,
      chainName: 'BSC Mainnet',
      nativeCurrency: {
        name: 'BNB',
        symbol: 'BNB',
        decimals: 18,
      },
      rpcUrls: LIST_BSC_MAINNET,
      blockExplorerUrls: ['https://bscscan.com'],
    },
  },
};
