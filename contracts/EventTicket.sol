// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol"; // Add this line

contract EventTicket is ERC721, Ownable {
  string public eventTitle;
  uint256 public eventTime;
  string public eventURL;
  uint256 public totalTickets;
  uint256 public ticketPrice;
  ERC20 public paymentTokenAddress; // GHO token address

  uint256 public _nextTokenId;
  uint256 public withdrawableAmount; // Total amount of tokens that can be withdrawn by the owner

  event TicketBought(address indexed buyer, uint256 ticketId);

  constructor(
    string memory name,
    string memory symbol,
    string memory _eventTitle,
    uint256 _eventTime,
    string memory _eventURL,
    uint256 _totalTickets,
    uint256 _ticketPrice,
    ERC20 _paymentTokenAddress
  ) ERC721(name, symbol) Ownable(msg.sender) {
    eventTitle = _eventTitle;
    eventTime = _eventTime;
    eventURL = _eventURL;
    totalTickets = _totalTickets;
    ticketPrice = _ticketPrice;
    paymentTokenAddress = _paymentTokenAddress;
  }

  function buyTicket() external {
    require(_nextTokenId <= totalTickets, "No more tickets for sale");
    require(
      paymentTokenAddress.balanceOf(msg.sender) >= ticketPrice,
      "Insufficient funds"
    );
    paymentTokenAddress.transferFrom(msg.sender, address(this), ticketPrice); // Transfer the tokens from the buyer to this contract
    withdrawableAmount += ticketPrice;

    _mint(msg.sender, _nextTokenId); // Mint the ticket to the intended recipient
    emit TicketBought(msg.sender, _nextTokenId);
    _nextTokenId++;
  }
}
