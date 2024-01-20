import { ethers } from "hardhat"

async function main() {
  const contractFactory = await ethers.getContractFactory("MyNFT")
  const contract = await contractFactory.deploy()

  const deployTx = await contract.deployed()

  console.log("MyNFT deployed to:", deployTx.address)
  console.log("TxHash:", deployTx.deployTransaction.hash)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
