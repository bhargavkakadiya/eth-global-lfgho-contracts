import { ethers } from "hardhat"
import { expect } from "chai"
import { EventTicket, MyERC20 } from "../typechain-types"
import { BigNumber } from "ethers"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"

describe("EventTicket", function () {
  let eventTicket: EventTicket
  let paymentToken: MyERC20
  let owner: SignerWithAddress
  let addr1: SignerWithAddress
  let addr2: SignerWithAddress

  const ticketPrice = ethers.utils.parseEther("1")
  const totalTickets = 100

  beforeEach(async function () {
    const EventTicket = await ethers.getContractFactory("EventTicket")
    const PaymentToken = await ethers.getContractFactory("MyERC20")

    ;[owner, addr1, addr2] = await ethers.getSigners()

    paymentToken = await PaymentToken.deploy("PaymentToken", "PT")
    await paymentToken.deployed()
    await paymentToken
      .connect(owner)
      .mint(addr1.address, ethers.utils.parseEther("100")) // Mint some tokens for addr1
    await paymentToken
      .connect(owner)
      .mint(addr2.address, ethers.utils.parseEther("100")) // Mint some tokens for addr2

    eventTicket = await EventTicket.deploy(
      "MyEvent",
      "EVT",
      "MyEventTitle",
      1708835080,
      "https://www.eventbrite.hk/e/rewind-party-the-belmont-january-edition-tickets-783786726197",
      totalTickets,
      ticketPrice,
      paymentToken.address
    )
    await eventTicket.deployed()
  })

  it("should deploy the contract correctly", async function () {
    expect(await eventTicket.totalTickets()).to.equal(totalTickets)
    expect(await eventTicket.ticketPrice()).to.equal(ticketPrice)
  })

  describe("Buying a ticket", async function () {
    let addr1PTBalanceBefore: BigNumber
    let buyTicket: any
    let buyTicketTx: any

    beforeEach(async function () {
      addr1PTBalanceBefore = await paymentToken.balanceOf(addr1.address)

      // approve the contract to spend the tokens
      const allowTx = await paymentToken
        .connect(addr1)
        .approve(eventTicket.address, ticketPrice)
      const allowTxReceipt = await allowTx.wait()

      buyTicket = await eventTicket.connect(addr1).buyTicket()
      buyTicketTx = await buyTicket.wait()
    })

    it("should increase the balance of the contract", async function () {
      expect(await eventTicket.withdrawableAmount()).to.equal(
        ethers.utils.parseEther("1")
      )
    })

    it("should deduct the correct amount from the sender/buyer", async function () {
      const addr1PTBalanceAfter = await paymentToken.balanceOf(addr1.address)
      expect(addr1PTBalanceAfter.add(ticketPrice)).to.equal(
        addr1PTBalanceBefore
      )
    })

    it("should mint the NFT to the buyer", async function () {
      expect(await eventTicket.balanceOf(addr1.address)).to.equal(1)
    })
  })
})
