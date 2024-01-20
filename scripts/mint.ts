// https://medium.com/0xmantle/how-to-create-an-nft-on-mantle-tutorial-part-ii-minting-the-deployed-nft-8874aac266b3

import dotenv from "dotenv";
dotenv.config();
import { JsonRpcProvider } from "@ethersproject/providers";
import { ethers } from "ethers";
import { Signer } from "ethers";

// Create a JsonRpcProvider instance
const rpcUrl = "https://rpc.testnet.mantle.xyz";
const chainId = 5001;
const provider = new JsonRpcProvider(rpcUrl, chainId);

// Create a signer using the private key from the environment variable
const privateKey = process.env.PRIVATE_KEY || "";
const signer = new ethers.Wallet(privateKey, provider);

// Get contract ABI and address
// import abi
import { abi } from "../artifacts/contracts/MyNFT.sol/MyNFT.json";
const contractAddress = "0x2e69af21833CfFd1f18403ebFDAe0A10BCb877d1";

// Create a contract instance
const myNftContract = new ethers.Contract(contractAddress, abi, signer);

// Get the NFT Metadata IPFS URL
const tokenUri =
  "https://gateway.pinata.cloud/ipfs/QmTseGFkp9FjMmXCaCLK1NpJXgjKshtP4v4x38jpvkpdat";

// Call mintNFT function
async function mintNFT() {
  let nftTxn = await myNftContract.mintNFT(signer.address, tokenUri);
  await nftTxn.wait();
  console.log(
    `NFT Minted! Check it out at: https://explorer.testnet.mantle.xyz/tx/${nftTxn.hash}`
  );
}

mintNFT()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
