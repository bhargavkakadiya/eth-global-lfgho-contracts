import dotenv from "dotenv";
dotenv.config();
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  paths: { tests: "tests" },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
    customChains: [
      //https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-verify#adding-support-for-other-networks
      {
        network: "mantle-testnet",
        chainId: 5001,
        urls: {
          apiURL: "https://explorer.testnet.mantle.xyz/api",
          browserURL: "https://explorer.testnet.mantle.xyz",
        },
      },
    ],
  },
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "",
      accounts: [PRIVATE_KEY],
    },
    goerli: {
      url: process.env.GOERLI_RPC_URL || "",
      accounts: [PRIVATE_KEY],
    },
    "mantle-testnet": {
      url: "https://rpc.testnet.mantle.xyz/",
      accounts: [PRIVATE_KEY],
    },
  },
};

export default config;
