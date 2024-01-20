// File: test/ConcertTicket.test.js
import { ethers } from "hardhat"
import { expect } from "chai"
import { EventTicket } from "../typechain-types"
import { BigNumber } from "ethers"

describe("EventTicket", function () {
  let eventTicket: EventTicket
  let owner: any
  let addr1: any
  let addr2: any

  const ticketPrice = ethers.utils.parseEther("1")
  const totalTickets = 100

  beforeEach(async function () {
    const EventTicket = await ethers.getContractFactory("EventTicket")
    ;[owner, addr1, addr2] = await ethers.getSigners()

    eventTicket = await EventTicket.deploy(totalTickets, ticketPrice)
    await eventTicket.deployed()
  })

  it("should deploy the contract correctly", async function () {
    expect(await eventTicket.totalTickets()).to.equal(totalTickets)
    expect(await eventTicket.ticketPrice()).to.equal(ticketPrice)
  })

  describe("Buying a ticket", async function () {
    let addr1BalanceBefore: any
    let buyTicket: any
    let buyTicketTx: any

    beforeEach(async function () {
      addr1BalanceBefore = await ethers.provider.getBalance(addr1.address)
      buyTicket = await eventTicket
        .connect(addr1)
        .buyTicket({ value: ticketPrice })
      buyTicketTx = await buyTicket.wait()
    })

    it("should increase the balance of the contract", async function () {
      expect(await ethers.provider.getBalance(eventTicket.address)).to.equal(
        ethers.utils.parseEther("1")
      )
    })

    it("should deduct the correct amount from the sender/buyer", async function () {
      const gasUsed = buyTicketTx.gasUsed.mul(buyTicketTx.effectiveGasPrice)
      const addr1BalanceAfter = await ethers.provider.getBalance(addr1.address)
      expect(addr1BalanceAfter.add(gasUsed).add(ticketPrice)).to.equal(
        addr1BalanceBefore
      )
    })

    it("should mint the NFT to the buyer", async function () {
      expect(await eventTicket.balanceOf(addr1.address)).to.equal(1)
    })
  })
})
