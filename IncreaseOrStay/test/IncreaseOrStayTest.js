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
            const amountToSend = ethers.utils.parseEther('10');

            await owner.sendTransaction({
                to: increaseOrStay.address,
                value: amountToSend,
            });
            const createGameTx = await increaseOrStay.connect(addr1).createGame({ value: ethers.utils.parseEther("0.05") });

            const receipt = await createGameTx.wait();
            const gameId = receipt.events.filter(x => x.event == "GameCreated")[0].args.gameId;

            const game = await increaseOrStay.games(gameId);
            expect(game.currentState).to.equal(0); // GameState.WaitingForPlayer
            expect(game.player).to.equal(addr1.address);
            expect(game.playerBet).to.equal(ethers.utils.parseEther("0.05"));
            expect(game.reward).to.equal(0);
            expect(game.currentState).to.equal(0);
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
            const amountToSend = ethers.utils.parseEther('10');

            await owner.sendTransaction({
                to: increaseOrStay.address,
                value: amountToSend,
            });
            await increaseOrStay.connect(addr1).createGame({ value: ethers.utils.parseEther("0.05") });
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

    describe("PlayGame", function () {

        it("If player win game round 1 state change to round2", async function () {
            const amountToSend = ethers.utils.parseEther('10');

            await owner.sendTransaction({
                to: increaseOrStay.address,
                value: amountToSend,
            });
            const tx = await increaseOrStay.connect(addr1).createGame({ value: ethers.utils.parseEther("0.05") });
            const receipt = await tx.wait();
            const gameId = receipt.events[0].args.gameId;
            let game = await increaseOrStay.games(gameId);
            await increaseOrStay.connect(addr1).playGame(gameId);
            game = await increaseOrStay.games(gameId);
            expect(game.currentState).to.equal(1);
        });

        it("If player win game round 2 state change to round3", async function () {
            const amountToSend = ethers.utils.parseEther('10');

            await owner.sendTransaction({
                to: increaseOrStay.address,
                value: amountToSend,
            });
            const tx = await increaseOrStay.connect(addr1).createGame({ value: ethers.utils.parseEther("0.05") });
            const receipt = await tx.wait();
            const gameId = receipt.events[0].args.gameId;
            let game = await increaseOrStay.games(gameId);
            await increaseOrStay.connect(addr1).playGame(gameId);
            await increaseOrStay.connect(addr1).playGame(gameId);
            game = await increaseOrStay.games(gameId);
            expect(game.currentState).to.equal(2);
        });

        it("If player win game round 3 state change to gameEnded", async function () {
            const amountToSend = ethers.utils.parseEther('10');

            await owner.sendTransaction({
                to: increaseOrStay.address,
                value: amountToSend,
            });
            await increaseOrStay.connect(addr1).createGame({ value: ethers.utils.parseEther("1") });
            const tx = await increaseOrStay.connect(addr1).createGame({ value: ethers.utils.parseEther("0.05") });
            const receipt = await tx.wait();
            const gameId = receipt.events[0].args.gameId;
            let game = await increaseOrStay.games(gameId);
            await increaseOrStay.connect(addr1).playGame(gameId);
            await increaseOrStay.connect(addr1).playGame(gameId);
            await increaseOrStay.connect(addr1).playGame(gameId);
            game = await increaseOrStay.games(gameId);
            expect(game.currentState).to.equal(5);
        });

        it("If player lose game round 1 state change to GameEnded", async function () {
            const amountToSend = ethers.utils.parseEther('10');

            await owner.sendTransaction({
                to: increaseOrStay.address,
                value: amountToSend,
            });
            const tx = await increaseOrStay.connect(addr1).createGame({ value: ethers.utils.parseEther("0.05") });
            const receipt = await tx.wait();
            const gameId = receipt.events[0].args.gameId;
            let game = await increaseOrStay.games(gameId);
            await increaseOrStay.connect(addr1).playGame(gameId);
            game = await increaseOrStay.games(gameId);
            expect(game.currentState).to.equal(5);
        });

        it("If player lose game round 2 state change to Game Ended", async function () {
            const amountToSend = ethers.utils.parseEther('10');

            await owner.sendTransaction({
                to: increaseOrStay.address,
                value: amountToSend,
            });
            const tx = await increaseOrStay.connect(addr1).createGame({ value: ethers.utils.parseEther("0.05") });
            const receipt = await tx.wait();
            const gameId = receipt.events[0].args.gameId;
            let game = await increaseOrStay.games(gameId);
            await increaseOrStay.connect(addr1).playGame(gameId);
            await increaseOrStay.connect(addr1).playGame(gameId);
            game = await increaseOrStay.games(gameId);
            expect(game.currentState).to.equal(5);
        });

        it("If player lose game round 3 state change to GameEnded", async function () {
            const amountToSend = ethers.utils.parseEther('10');

            await owner.sendTransaction({
                to: increaseOrStay.address,
                value: amountToSend,
            });
            await increaseOrStay.connect(addr1).createGame({ value: ethers.utils.parseEther("1") });
            const tx = await increaseOrStay.connect(addr1).createGame({ value: ethers.utils.parseEther("0.05") });
            const receipt = await tx.wait();
            const gameId = receipt.events[0].args.gameId;
            let game = await increaseOrStay.games(gameId);
            await increaseOrStay.connect(addr1).playGame(gameId);
            await increaseOrStay.connect(addr1).playGame(gameId);
            await increaseOrStay.connect(addr1).playGame(gameId);
            game = await increaseOrStay.games(gameId);
            expect(game.currentState).to.equal(5);
        });

        it("Other Player will not able to play a active game if its not the same player", async function () {
            const amountToSend = ethers.utils.parseEther('10');

            await owner.sendTransaction({
                to: increaseOrStay.address,
                value: amountToSend,
            });
            await increaseOrStay.connect(addr1).createGame({ value: ethers.utils.parseEther("1") });
            const tx = await increaseOrStay.connect(addr1).createGame({ value: ethers.utils.parseEther("0.05") });
            const receipt = await tx.wait();
            const gameId = receipt.events[0].args.gameId;
            await expect(increaseOrStay.connect(addr2).playGame(gameId)).to.be.revertedWith("Not the Same Player");
        })

        it("Contract will not allow player to join if there is not enough ether", async function () {
            const amountToSend = ethers.utils.parseEther('1');

            await owner.sendTransaction({
                to: increaseOrStay.address,
                value: amountToSend,
            });
            await expect(increaseOrStay.connect(addr1).createGame({ value: ethers.utils.parseEther("1") })).to.be.revertedWith("Contract does not have enough Ether");
        })

    });

    describe("withdraw", function () {
        it("Player able to withdraw whenever they want", async function () {
            const amountToSend = ethers.utils.parseEther('10');

            await owner.sendTransaction({
                to: increaseOrStay.address,
                value: amountToSend,
            });
            await increaseOrStay.connect(addr1).createGame({ value: ethers.utils.parseEther("1") });
            const tx = await increaseOrStay.connect(addr1).createGame({ value: ethers.utils.parseEther("0.05") });
            const receipt = await tx.wait();
            const gameId = receipt.events[0].args.gameId;
            let game = await increaseOrStay.games(gameId);
            await increaseOrStay.connect(addr1).playGame(gameId);
            game = await increaseOrStay.games(gameId);
            expect(game.currentState).to.equal(1);
            await increaseOrStay.connect(addr1).Withdraw(gameId);
            game = await increaseOrStay.games(gameId);
            expect(game.currentState).to.equal(5);
        });

        it("other Player will not able to withdraw if a game with another player in", async function () {
            const amountToSend = ethers.utils.parseEther('10');

            await owner.sendTransaction({
                to: increaseOrStay.address,
                value: amountToSend,
            });
            await increaseOrStay.connect(addr1).createGame({ value: ethers.utils.parseEther("1") });
            const tx = await increaseOrStay.connect(addr1).createGame({ value: ethers.utils.parseEther("0.05") });
            const receipt = await tx.wait();
            const gameId = receipt.events[0].args.gameId;
            let game = await increaseOrStay.games(gameId);
            await increaseOrStay.connect(addr1).playGame(gameId);
            game = await increaseOrStay.games(gameId);
            expect(game.currentState).to.equal(1);
            await expect(increaseOrStay.connect(addr2).Withdraw(gameId)).to.be.revertedWith("Not the Same Player");
        });
    })

    describe("HouseEdge", function () {
        it("HouseEdge from the smart contract should be the same as the draft", async function () {
            const amountToSend = ethers.utils.parseEther('1000');

            await owner.sendTransaction({
                to: increaseOrStay.address,
                value: amountToSend,
            });
            let totalReward = 0;
            let totalBet = 0;
            const numGames = 50;

            for (let i = 0; i < numGames; i++) {
                totalBet += 1;
                const playerBet = ethers.utils.parseEther("1"); // Set your desired bet amount
                await increaseOrStay.connect(addr1).createGame({ value: playerBet });

                const gameId = i + 1;
                await increaseOrStay.connect(addr1).playGame(gameId);

                let game = await increaseOrStay.games(gameId);
                let reward = parseFloat(ethers.utils.formatEther(game.reward));
                if (game.currentState == 1) {
                    await increaseOrStay.connect(addr1).playGame(gameId);
                    game = await increaseOrStay.games(gameId);
                    reward = parseFloat(ethers.utils.formatEther(game.reward));
                    if (game.currentState == 2) {
                        await increaseOrStay.connect(addr1).playGame(gameId);
                        game = await increaseOrStay.games(gameId);
                        reward = parseFloat(ethers.utils.formatEther(game.reward));
                        totalReward += reward;
                    }
                }
            }
            const houseEdge = (totalBet - totalReward) / totalBet;
            console.log(houseEdge * 100);
        });
    })
});