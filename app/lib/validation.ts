// Functions for validating addresses for different chains

// Validates Ethereum-style addresses (Ethereum, BSC, Arbitrum, Base, Blast, etc.)
export const isValidEthereumAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

// Validates Avalanche X-Chain address
export const isValidAvalancheXAddress = (address: string): boolean => {
  return /^X-[a-zA-Z0-9]{39}$/.test(address);
};

// Validates Avalanche P-Chain address
export const isValidAvalanchePAddress = (address: string): boolean => {
  return /^P-[a-zA-Z0-9]{39}$/.test(address);
};

// Validates Avalanche C-Chain address (same as Ethereum)
export const isValidAvalancheCAddress = (address: string): boolean => {
  return isValidEthereumAddress(address);
};

// Main validation function that considers the chain type
export const isValidAddress = (address: string, chain: string): boolean => {
  if (!address) return false;

  // Trim address to handle any leading/trailing whitespace
  address = address.trim();

  // For EVM-compatible chains (Ethereum, BSC, Arbitrum, Base, Blast)
  if (
    chain === "eth" ||
    chain === "bsc" ||
    chain === "arbitrum" ||
    chain === "base" ||
    chain === "blast" ||
    chain === "eth-sepolia"
  ) {
    return isValidEthereumAddress(address);
  }

  // For Avalanche (check various chain types)
  if (chain === "avalanche") {
    // C-Chain addresses (EVM compatible) start with 0x
    if (address.startsWith("0x")) {
      return isValidAvalancheCAddress(address);
    }
    // X-Chain addresses start with X-
    else if (address.startsWith("X-")) {
      return isValidAvalancheXAddress(address);
    }
    // P-Chain addresses start with P-
    else if (address.startsWith("P-")) {
      return isValidAvalanchePAddress(address);
    }
    // If none of the above, it's not a valid Avalanche address
    return false;
  }

  // Default to Ethereum validation if chain is not specifically handled
  return isValidEthereumAddress(address);
};
