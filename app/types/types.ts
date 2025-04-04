export type Wallet_Type = {
  _id: string;
  address: string;
  name: string;
  status: boolean;
  color?: string;
  audio: string;
  chain: string;
  userId: string;
};

export type Transaction_Type = {
  _id: string;
  wallet_id: Wallet_Type;
  chain: string;
  status: string;
  txHash: string;
  from?: string;
  to?: string;
  action?: string;
  track_point: number;
};

export type Chain_Type = {
  value: string;
  name: string;
  explorerUrl: string;
};

export const CHAIN_EXPLORER_URLS: Record<string, string> = {
  eth: "https://etherscan.io",
  bsc: "https://bscscan.com",
  base: "https://basescan.org",
  arbitrum: "https://arbiscan.io",
  blast: "https://blastscan.io",
  avalanche: "https://snowtrace.io",
  "eth-sepolia": "https://sepolia.etherscan.io",
};

export const CHAINS: Chain_Type[] = [
  {
    value: "eth",
    name: "Eth-Mainnet",
    explorerUrl: CHAIN_EXPLORER_URLS["eth"],
  },
  {
    value: "bsc",
    name: "BSC",
    explorerUrl: CHAIN_EXPLORER_URLS["bsc"],
  },
  {
    value: "base",
    name: "Base",
    explorerUrl: CHAIN_EXPLORER_URLS["base"],
  },
  {
    value: "blast",
    name: "Blast",
    explorerUrl: CHAIN_EXPLORER_URLS["blast"],
  },
  {
    value: "arbitrum",
    name: "Arbitrum",
    explorerUrl: CHAIN_EXPLORER_URLS["arbitrum"],
  },
  {
    value: "avalanche",
    name: "Avalanche",
    explorerUrl: CHAIN_EXPLORER_URLS["avalanche"],
  },
  {
    value: "eth-sepolia",
    name: "Eth-Sepolia",
    explorerUrl: CHAIN_EXPLORER_URLS["eth-sepolia"],
  },
];

export type Audio_Type = {
  value: string;
  label: string;
};

export const AUDIO_OPTIONS: Audio_Type[] = [
  {
    value: "",
    label: "None",
  },
  {
    value: "/audio/alarm-clock-90867.mp3",
    label: "Alarm Clock",
  },
  {
    value: "/audio/clock-alarm-8761.mp3",
    label: "Clock Alarm",
  },
  {
    value: "/audio/digital-alarm-clock-151920.mp3",
    label: "Digital Alarm",
  },
  {
    value: "/audio/generic-alarm-clock-86759.mp3",
    label: "Generic Alarm",
  },
];

// Helper function to get the explorer URL for a chain
export const getExplorerUrl = (chain: string): string => {
  return CHAIN_EXPLORER_URLS[chain] || CHAIN_EXPLORER_URLS["eth"]; // Default to Ethereum
};

export type Folder_Type = {
  id: string;
  name: string;
  createdAt: string;
  color: string;
  walletCount: number;
  chains: string[];
};
