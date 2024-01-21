import { ethers } from "hardhat"

async function main() {
  const GHOTokenAddress = "0xc4bF5CbDaBE595361438F8c6a187bDc330539c60"
  const contractFactory = await ethers.getContractFactory("EventTicketFactory")

  // const contract = await contractFactory.deploy(
  //   "MyEvent",
  //   "EVT",
  //   "MyEventTitle",
  //   1708835080,
  //   "https://www.eventbrite.hk/e/rewind-party-the-belmont-january-edition-tickets-783786726197",
  //   100,
  //   ethers.utils.parseEther("1"),
  //   GHOTokenAddress
  // )

  const contract = await contractFactory.deploy()

  const deployTx = await contract.deployed()

  console.log("Event Ticket Factory deployed to:", deployTx.address)
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
