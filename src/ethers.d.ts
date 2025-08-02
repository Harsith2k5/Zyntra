// src/ethers.d.ts
export {};

declare global {
  interface Window {
    ethereum?: any; // or specify type as `Ethereum` from `@metamask/providers`
  }
}
