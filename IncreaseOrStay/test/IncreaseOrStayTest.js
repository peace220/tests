const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NumberGame tests set #1", function () { 
    let owner;
    let addr1;
    let addr2;
    let addrs;

    beforeEach(async function () {
        IncreaseOrStay = await ethers.getContractFactory("IncreaseOrStay");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        increaseOrStay = await IncreaseOrStay.deploy(ethers.utils.parseEther("0.05"));

    });
});