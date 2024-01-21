import { ethers } from "hardhat"

async function main() {
  const GHOTokenAddress = "0x5d00fab5f2f97c4d682c1053cdcaa59c2c37900d"
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
