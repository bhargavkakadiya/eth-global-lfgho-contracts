import { ethers } from "hardhat"

async function main() {
  const GHOTokenAddress = "0xc4bF5CbDaBE595361438F8c6a187bDc330539c60"
  const contractFactory = await ethers.getContractFactory("EventTicket")
  const contract = await contractFactory.deploy(100, 1, GHOTokenAddress)

  const deployTx = await contract.deployed()

  console.log("Event Ticket deployed to:", deployTx.address)
  console.log("TxHash:", deployTx.deployTransaction.hash)
  console.log(
    "Explorer:",
    `https://sepolia.etherscan.io/address/${deployTx.address}`
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
