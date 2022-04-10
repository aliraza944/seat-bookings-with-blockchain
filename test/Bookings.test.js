import assert from "assert";
import ganache from "ganache-cli";
import Web3 from "web3";
import { abi } from "../build/abi.js";
import { evm } from "../build/evm.js";

const web3 = new Web3(ganache.provider());

let bookings;
let accounts;
beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  bookings = await new web3.eth.Contract(abi)
    .deploy({ data: evm.bytecode.object, arguments: [10, 200] })
    .send({ from: accounts[0], gas: 1000000 });
});

describe("Bookings", () => {
  it("deploys a contract", () => {
    assert.ok(bookings.options.address);
  });

  it("has a manager", async () => {
    const manager = await bookings.methods.manager().call();
    assert.equal(accounts[0], manager);
  });

  it("has fixed no of seats", async () => {
    const seats = await bookings.methods.totalNumOfSeats().call();
    assert.equal(10, seats);
  });

  it("has a minimum seat price", async () => {
    const price = await bookings.methods.ticketPrice().call();
    assert.equal(price, 200);
  });

  it("books a seat", async () => {
    await bookings.methods
      .bookASeat(1)
      .send({ from: accounts[1], value: "200" });
    const booked = await bookings.methods.isSeatBooked(1).call();
    assert(booked);
  });

  it("gets seat details", async () => {
    await bookings.methods
      .bookASeat(1)
      .send({ from: accounts[1], value: "200" });
    const details = await bookings.methods.getSeatDetails(1).call();
    assert.equal(accounts[1], details.passanger);
    assert.equal(1, details.seatnumber);
  });

  it("does not let same seat geting  booked", async () => {
    await bookings.methods
      .bookASeat(1)
      .send({ from: accounts[1], value: "200" });
    try {
      await bookings.methods
        .bookASeat(1)
        .send({ from: accounts[2], value: "200" });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it("lets manager reset all the bookings", async () => {
    await bookings.methods
      .bookASeat(1)
      .send({ from: accounts[1], value: "200" });
    await bookings.methods.resetAllBookings().send({ from: accounts[0] });
    const booked = await bookings.methods.isSeatBooked(1).call();
    assert(!booked);
  });
});
