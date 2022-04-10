// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Bookings {
    address public manager;
    uint256 public totalNumOfSeats;
    //check if the seat is booked;
    mapping(uint256 => bool) public isSeatBooked;
    uint256 public ticketPrice;
    struct SeatDetail {
        uint256 seatNumber;
        address passenger;
    }
    // SeatDetail[] public seatDetails;
    mapping(uint256 => SeatDetail) public seatDetails;

    constructor(uint256 mySeats, uint256 price) {
        manager = msg.sender;
        totalNumOfSeats = mySeats;
        ticketPrice = price;
    }

    function bookASeat(uint256 seat) public payable {
        require(isSeatBooked[seat] = true);
        require(!(seat > totalNumOfSeats));
        require(msg.value >= ticketPrice);
        isSeatBooked[seat] = true;

        SeatDetail memory newSeat = SeatDetail({
            seatNumber: seat,
            passenger: msg.sender
        });

        seatDetails[seat] = newSeat;
    }

    function getSeatDetails(uint256 seatNumber)
        public
        view
        returns (uint256 seatnumber, address passanger)
    {
        seatnumber = seatDetails[seatNumber].seatNumber;
        passanger = seatDetails[seatNumber].passenger;
    }

    function resetAllBookings() public {
        require(msg.sender == manager);
        for (uint256 i = 0; i < totalNumOfSeats; i++) {
            isSeatBooked[i] = false;
        }
    }
}
