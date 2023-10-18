const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let totalWins = 0;
let totalLosses = 0;
let totalReward = 0;
let totalGame = 0;
let game=1;
const INITIAL_BET = 1;
const TOTAL_SIMULATIONS = 3000;
let totalHouseEdge = 0;
let totalBets = 0;
let houseEdge = 0
function getReward(round) {
    const randomValue = Math.random();

    let rewardMultiplier;
    switch (round) {
        case 1: // EV =5.46%
            totalBets += INITIAL_BET;
            if (randomValue < 0.2) return 0;
            else if (randomValue < 0.5) rewardMultiplier = (Math.random() * 0.5) + 0.4; // 40% to 90%
            else if (randomValue < 0.9) rewardMultiplier = (Math.random() * 0.5) + 1; // 100% to 150%
            else rewardMultiplier = (Math.random() * 1) + 2; // 200% to 300%
            break;

        // case 1:// EV =7.92%
        // totalBets += INITIAL_BET;
        //     if (randomValue < 0.3) return 0;
        //     else if (randomValue < 0.5) rewardMultiplier = (Math.random() * 0.5) + 0.4; // 40% to 90%
        //     else if (randomValue < 0.9) rewardMultiplier = (Math.random() * 1) + 1; // 150% to 165%
        //     else rewardMultiplier = (Math.random() * 1.8) + 1; // 300% to 500%
        //     break;

        // case 1://EV =9.5%
        // totalBets += INITIAL_BET;
        //     if (randomValue < 0.4) return 0;
        //     else if (randomValue < 0.5) rewardMultiplier = (Math.random() * 0.5) + 0.4; // 40% to 90%
        //     else if (randomValue < 0.9) rewardMultiplier = (Math.random() * 1.2) + 1; // 200% to 300%
        //     else rewardMultiplier = (Math.random() * 2) + 1; // 400% to 700%
        //     break;
        default:
            console.log("Invalid round");
            return 0;
    }

    return parseFloat((INITIAL_BET * rewardMultiplier).toFixed(2));
}

function playgame(round = 1) {
    const reward = getReward(round);

    totalGame = totalWins + totalLosses;
    if (reward === 0 || round === 2) {
        if (reward === 0) {
            totalLosses++;
        }
        else {
            totalReward += reward;

            totalWins++;
        }

        if (totalGame < TOTAL_SIMULATIONS) {
            playgame();
        } else {

            totalBets-=1;
            totalGame=0;
            totalWins=0;
            totalLosses=0;
            houseEdge = (totalBets - totalReward) / totalBets;
            rl.close();
        }
    } else {
        playgame(round + 1);
    }
}



for (iteration = 0; iteration < 1000; iteration++) {
    totalBets=0;
    totalReward=0;
    totalGame=0;
    playgame()
    totalHouseEdge += houseEdge;
}

const averageHouseEdge = totalHouseEdge / 1000;
console.log(`Average House Edge: ${(averageHouseEdge * 100).toFixed(2)}%`);