// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./EventTicket.sol";

contract EventTicketFactory {
  // Array to keep track of all deployed EventTicket contracts
  address[] public eventTickets;

  // Event that will be emitted whenever a new EventTicket contract is created
  event EventTicketCreated(address eventTicketAddress);

  function createEventTicket(
    string memory name,
    string memory symbol,
    string memory _eventTitle,
    uint256 _eventTime,
    string memory _eventURL,
    uint256 _totalTickets,
    uint256 _ticketPrice,
    ERC20 _paymentTokenAddress
  ) external returns (address) {
    // Create a new EventTicket contract
    EventTicket newEventTicket = new EventTicket(
      name,
      symbol,
      _eventTitle,
      _eventTime,
      _eventURL,
      _totalTickets,
      _ticketPrice,
      _paymentTokenAddress
    );

    // Add the new EventTicket contract to the array
    eventTickets.push(address(newEventTicket));

    // Emit the EventTicketCreated event
    emit EventTicketCreated(address(newEventTicket));

    // Return the new EventTicket contract
    return address(newEventTicket);
  }

  // Function to get the count of deployed EventTicket contracts
  function getEventTicketCount() external view returns (uint256) {
    return eventTickets.length;
  }
}
