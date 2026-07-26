# Decentralized Land Ledger 🌍🔗

A secure, Web3-powered fractional land market and property registry. This decentralized application (dApp) allows users to mint, view, and securely trade real estate deeds using blockchain technology, cryptographic identity hashing, and interactive spatial mapping.

## 🚀 Features

*   **Factory Pattern Architecture:** Deploys a distinct, isolated smart contract (`LandRegistry`) for every individual property via a central factory (`AllLandRegistry`), ensuring clean state management and secure ownership tracking.
*   **Cryptographic Privacy:** Government IDs (like a 12-digit Aadhaar) are never stored in plain text. They are hashed locally on the frontend using `keccak256` before interacting with the blockchain, ensuring zero-knowledge on-chain privacy.
*   **Interactive Spatial Boundaries:** Integrates `react-leaflet` and OpenStreetMap to render actual geographical polygon boundaries (P1 to P4) for every plot of land directly in the browser.
*   **Brutalist Custom UI:** Designed with a striking, high-contrast brutalist aesthetic utilizing standard, traditional CSS properties for layout and styling.
*   **Secure Value Transfer:** Built-in safeguards preventing owners from buying their own land and utilizing the robust Checks-Effects-Interactions pattern to prevent reentrancy attacks.
*   **IPFS Integration:** Property images and visual deeds are decentralized and fetched via IPFS gateways.

## 🛠️ Tech Stack

**Frontend:**
*   React.js (Vite)
*   Ethers.js (v6) for Web3 injection and blockchain interaction
*   Leaflet & React-Leaflet for interactive map rendering
*   Lucide React for iconography
*   Traditional CSS for custom styling

**Backend / Smart Contracts:**
*   Solidity (^0.8.28)
*   Hardhat / Foundry for compilation and deployment
*   Infura / Alchemy as the RPC node provider

## 📦 Installation & Setup

### 1. Clone the Repository
```bash
git clone [https://github.com/yourusername/land-registry-dapp.git](https://github.com/yourusername/land-registry-dapp.git)
cd land-registry-dapp