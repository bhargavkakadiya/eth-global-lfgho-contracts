import { ethers } from "hardhat"

async function main() {
  const GHOTokenAddress = "0xc4bF5CbDaBE595361438F8c6a187bDc330539c60"
  //   const contractFactory = await ethers.getContractFactory("EventTicketFactory")

  const eventTicketFactory = await ethers.getContractAt(
    "EventTicketFactory",
    "0x5b8760b25a0b8be1695adf71414fcec6dfa6ab75"
  )

  const createEventTicket = await eventTicketFactory.createEventTicket(
    "MyEvent",
    "EVT",
    "MyEventTitle2",
    1708835080,
    "https://www.eventbrite.hk/e/rewind-party-the-belmont-january-edition-tickets-783786726197",
    100,
    ethers.utils.parseEther("1"),
    GHOTokenAddress
  )
  const createEventTicketTx = await createEventTicket.wait()
  const eventTicketAddress = createEventTicketTx.logs[0]["address"]

  console.log("Event Ticket created at:", eventTicketAddress)
  console.log("TxHash:", createEventTicketTx.transactionHash)
  console.log(
    "Explorer:",
    `https://sepolia.etherscan.io/tx/${createEventTicketTx.transactionHash}`
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
