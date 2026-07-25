import { defineConfig } from "hardhat/config";
import hardhatEthers from "@nomicfoundation/hardhat-ethers";
import "dotenv/config";

const { INFURA_API_KEY, PRIVATE_KEY } = process.env;

export default defineConfig({
  plugins: [hardhatEthers],
  solidity: "0.8.28",
  defaultNetwork: "sepolia",
  networks: {
    hardhat: {
      type: "edr-simulated",
    },
    sepolia: {
      type: "http",
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },
});
