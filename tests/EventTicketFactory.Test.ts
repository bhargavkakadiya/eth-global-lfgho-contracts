import { ethers } from "hardhat"
import { expect } from "chai"
import { EventTicketFactory, EventTicket, MyERC20 } from "../typechain-types"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { BigNumber } from "ethers"

describe("EventTicketFactory", function () {
  let eventTicketFactory: EventTicketFactory
  let paymentToken: MyERC20
  let owner: SignerWithAddress
  let addr1: SignerWithAddress
  let addr2: SignerWithAddress

  const ticketPrice = ethers.utils.parseEther("1")
  const totalTickets = 100

  beforeEach(async function () {
    const EventTicketFactory = await ethers.getContractFactory(
      "EventTicketFactory"
    )
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

    eventTicketFactory = await EventTicketFactory.deploy()
    await eventTicketFactory.deployed()
  })

  it("should deploy the contract correctly", async function () {
    expect(await eventTicketFactory.getEventTicketCount()).to.equal(0)
  })

  describe("Creating a new EventTicket contract", async function () {
    let eventTicketAddress: any
    let createEventTicket: any
    let createEventTicketTx: any

    beforeEach(async function () {
      createEventTicket = await eventTicketFactory.createEventTicket(
        "MyEvent",
        "EVT",
        "MyEventTitle",
        1708835080,
        "https://www.eventbrite.hk/e/rewind-party-the-belmont-january-edition-tickets-783786726197",
        totalTickets,
        ticketPrice,
        paymentToken.address
      )
      createEventTicketTx = await createEventTicket.wait()
      eventTicketAddress = createEventTicketTx.logs[0]["address"]
    })

    it("should create a new EventTicket contract", async function () {
      expect(await eventTicketFactory.getEventTicketCount()).to.equal(1)
    })

    it("new event ticket contract should have the correct values", async function () {
      const eventTicket = await ethers.getContractAt(
        "EventTicket",
        eventTicketAddress
      )
      expect(await eventTicket.totalTickets()).to.equal(totalTickets)
      expect(await eventTicket.ticketPrice()).to.equal(ticketPrice)
      expect(await eventTicket.eventTitle()).to.equal("MyEventTitle")
      expect(await eventTicket.eventTime()).to.equal(1708835080)
      expect(await eventTicket.eventURL()).to.equal(
        "https://www.eventbrite.hk/e/rewind-party-the-belmont-january-edition-tickets-783786726197"
      )
      expect(await eventTicket.paymentTokenAddress()).to.equal(
        paymentToken.address
      )
    })

    describe("Buying a ticket on created event", async function () {
      let addr1PTBalanceBefore: BigNumber
      let buyTicket: any
      let buyTicketTx: any
      let eventTicket: EventTicket
      beforeEach(async function () {
        addr1PTBalanceBefore = await paymentToken.balanceOf(addr1.address)
        eventTicket = await ethers.getContractAt(
          "EventTicket",
          eventTicketAddress
        )

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
})
