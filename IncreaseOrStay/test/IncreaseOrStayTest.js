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

    describe("createGame", function () {
        it("should create a new game with the correct initial state", async function () {
            const createGameTx = await increaseOrStay.connect(addr1).createGame({value: ethers.utils.parseEther("0.05")});

            const receipt = await createGameTx.wait();
            const gameId = receipt.events.filter(x => x.event == "GameCreated")[0].args.gameId;

            const game = await increaseOrStay.games(gameId);
            expect(game.currentState).to.equal(0); // GameState.NewGame
            expect(game.player).to.equal(addr1.address);
            expect(game.minimumBet).to.equal(ethers.utils.parseEther("0.05"));
            expect(game.reward).to.equal(ethers.utils.parseEther("0.05"));
        });
    });

    describe("setNextGameId", function () {

        const GameState = {
            NewGame: 0,
            WaitingForPlayer: 1,
            BothPlayersJoined: 2,
            AwaitingNewBets: 3,
            GameEnded: 4
        };
        // Testing boundary conditions
        it("should successfully create a game and increment nextGameId", async function () {
            await increaseOrStay.connect(addr1).createGame({value: ethers.utils.parseEther("0.05")});
            const currentNextGameId = await increaseOrStay.nextGameId();
            await increaseOrStay.setNextGameId(currentNextGameId.sub(1));
            const updatedNextGameId = await increaseOrStay.nextGameId();
            expect(updatedNextGameId).to.equal(currentNextGameId.sub(1));
        });

        it("should revert if trying to set next game ID to the current value", async function () {
            const currentNextGameId = await increaseOrStay.nextGameId();
            await expect(increaseOrStay.setNextGameId(currentNextGameId)).to.be.revertedWith("Invalid game ID");
        });

        it("should revert if trying to set next game ID to zero", async function () {
            await expect(increaseOrStay.setNextGameId(0)).to.be.revertedWith("Invalid game ID");
        });
    });
});