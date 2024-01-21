// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract EventTicket is ERC721, Ownable {
  uint256 private _nextTokenId;
  uint256 public totalTickets;
  uint256 public ticketPrice;
  address public paymentTokenAddress; // GHO token address

  event TicketBought(address indexed buyer, uint256 ticketId);

  constructor(
    uint256 _totalTickets,
    uint256 _ticketPrice,
    address _paymentTokenAddress
  ) ERC721("EventTicket", "ETK") Ownable(msg.sender) {
    totalTickets = _totalTickets;
    ticketPrice = _ticketPrice;
    paymentTokenAddress = _paymentTokenAddress;
  }

  function buyTicket() public {
    require(_nextTokenId <= totalTickets, "No more tickets for sale");

    IERC20 token = IERC20(paymentTokenAddress);
    require(
      token.transferFrom(msg.sender, address(this), ticketPrice),
      "Token transfer failed"
    );

    _mint(msg.sender, _nextTokenId); // Mint the ticket to the intended recipient
    emit TicketBought(msg.sender, _nextTokenId);
    _nextTokenId++;
  }
}
