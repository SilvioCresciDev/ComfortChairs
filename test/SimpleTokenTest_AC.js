// SPDX-License-Identifier: MIT

// Based on https://github.com/OpenZeppelin/openzeppelin-solidity/blob/v2.5.1/test/examples/SimpleToken.test.js

const { expect } = require("chai");

// Import accounts

var Web3 = require("web3");
var web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));

// Import utilities from Test Helpers
const {
  BN,
  expectEvent,
  expectRevert,
  constants,
} = require("@openzeppelin/test-helpers");

// Load compiled artifacts
const Coin = artifacts.require("Coin");

const ROLE = web3.utils.sha3("MINTER_ROLE");

const bo = new BN("0");
// Start test block
contract("Coin", function ([creator, minter, other]) {
  const NAME = "Coin";
  const SYMBOL = "C";
  const TOTAL_SUPPLY = new BN("10000000000000000000000");

  beforeEach(async function () {
    this.token = await Coin.new(NAME, SYMBOL, TOTAL_SUPPLY, {
      from: creator,
    });
  });

  it("retrieve returns a value previously stored", async function () {
    // Use large integer comparisons
    expect(await this.token.totalSupply()).to.be.bignumber.equal(TOTAL_SUPPLY);
  });

  it("has a name", async function () {
    expect(await this.token.name()).to.be.equal(NAME);
  });

  it("has a symbol", async function () {
    expect(await this.token.symbol()).to.be.equal(SYMBOL);
  });

  it("assigns the initial total supply to the creator", async function () {
    expect(await this.token.balanceOf(creator)).to.be.bignumber.equal(
      TOTAL_SUPPLY
    );
  });

  it("check if creator is admin", async function () {
    expect(await this.token.isAdmin(creator)).to.be.true;
  });

  it("check addMintRole", async function () {
    expect(await this.token.isMinter(minter)).to.equal(false);

    const receipt = await this.token.addMinterRole(minter, { from: creator });
    expectEvent(receipt, "RoleGranted", {
      account: minter,
      role: ROLE,
      sender: creator,
    });

    expect(await this.token.isMinter(minter)).to.equal(true);
  });

  it("check addMintRole from minter", async function () {
    expect(await this.token.isMinter(other)).to.equal(false);

    await expectRevert(
      this.token.addMinterRole(other, { from: minter }),
      "Restricted to admins"
    );

    expect(await this.token.isMinter(minter)).to.equal(false);
  });

  it("check mint from minter", async function () {
    const receipt1 = await this.token.addMinterRole(minter, { from: creator });
    expectEvent(receipt1, "RoleGranted", {
      account: minter,
      role: ROLE,
      sender: creator,
    });

    const receipt2 = await this.token.mint(other, new BN("50000000000"), {
      from: minter,
    });
    expectEvent(receipt2, "Transfer");
  });

  it("check mint from non-minter", async function () {
    await expectRevert(
      this.token.mint.call(minter, new BN("50000000000"), { from: other }),
      "Caller is not a minter"
    );
  });

  it("check removeMintRole from minter", async function () {
    const receipt1 = await this.token.addMinterRole(minter, { from: creator });
    expectEvent(receipt1, "RoleGranted", {
      account: minter,
      role: ROLE,
      sender: creator,
    });

    expect(await this.token.isMinter(minter)).to.equal(true);

    const receipt2 = await this.token.removeMinterRole(minter, {
      from: minter,
    });
    expectEvent(receipt2, "RoleRevoked");

    expect(await this.token.isMinter(minter)).to.equal(false);
  });

  it("should return the correct item ID for the first item of the ComfortChairs", async function () {
    const price = "25000000000000000000";
    const itemId = 0;

    const result = await this.token.payItem.call(price, itemId, {
      from: creator,
    });
    expect(result.toNumber()).to.equal(itemId);
  });

  it("should return the correct item ID for the second item of the ComfortChairs", async function () {
    const price = "20000000000000000000";
    const itemId = 1;

    const result = await this.token.payItem.call(price, itemId, {
      from: creator,
    });
    expect(result.toNumber()).to.equal(itemId);
  });

  it("should return the correct item ID for the third item of the ComfortChairs", async function () {
    const price = "30000000000000000000";
    const itemId = 2;

    const result = await this.token.payItem.call(price, itemId, {
      from: creator,
    });
    expect(result.toNumber()).to.equal(itemId);
  });

  it("should return the correct item ID for the fourth item of the ComfortChairs", async function () {
    const price = "35000000000000000000";
    const itemId = 3;

    const result = await this.token.payItem.call(price, itemId, {
      from: creator,
    });
    expect(result.toNumber()).to.equal(itemId);
  });

  it("should return the correct item ID for the fifth item of the ComfortChairs", async function () {
    const price = "60000000000000000000";
    const itemId = 4;

    const result = await this.token.payItem.call(price, itemId, {
      from: creator,
    });
    expect(result.toNumber()).to.equal(itemId);
  });

  it("should return the correct item ID for the sixth item of the ComfortChairs", async function () {
    const price = "125000000000000000000";
    const itemId = 5;

    const result = await this.token.payItem.call(price, itemId, {
      from: creator,
    });
    expect(result.toNumber()).to.equal(itemId);
  });

  it("should return the correct item ID for the seventh item of the ComfortChairs", async function () {
    const price = "120000000000000000000";
    const itemId = 6;

    const result = await this.token.payItem.call(price, itemId, {
      from: creator,
    });
    expect(result.toNumber()).to.equal(itemId);
  });

  it("should return the correct item ID for the eighth item of the ComfortChairs", async function () {
    const price = "400000000000000000000";
    const itemId = 7;

    const result = await this.token.payItem.call(price, itemId, {
      from: creator,
    });
    expect(result.toNumber()).to.equal(itemId);
  });
});