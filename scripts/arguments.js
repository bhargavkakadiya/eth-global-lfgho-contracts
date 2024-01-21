// yarn hardhat verify --network sepolia --constructor-args utils/arguments.js <contract code>
//yarn hardhat verify --network sepolia --constructor-args utils/arguments.js 0xBEd8efAbfB986EF7b791CDE1694FC1EB56db0DFc
// https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-verify#complex-arguments

const { ethers } = require("hardhat")

const GHOTokenAddress = "0xc4bF5CbDaBE595361438F8c6a187bDc330539c60"
ticketPrice = ethers.utils.parseEther("1")

module.exports = [
  "MyEvent",
  "EVT",
  "MyEventTitle",
  1708835080,
  "https://www.eventbrite.hk/e/rewind-party-the-belmont-january-edition-tickets-783786726197",
  100,
  ticketPrice,
  GHOTokenAddress,
]
