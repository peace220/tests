const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let totalWins = 0;
let totalLosses = 0;
let totalReward = 0;
let totalGame = 0;
const INITIAL_BET = 100;
const TOTAL_SIMULATIONS = 3000;
let totalHouseEdge = 0;
let totalBets = 0;
let houseEdge = 0
function getReward(round) {
    const randomValue = Math.random();

    let rewardMultiplier;
    switch (round) {
        case 1:
            if (randomValue < 0.2) return 0;
            else if (randomValue < 0.5) rewardMultiplier = (Math.random() * 0.5) + 0.4; // 40% to 90%
            else if (randomValue < 0.9) rewardMultiplier = (Math.random() * 0.5) + 1; // 100% to 150%
            else rewardMultiplier = (Math.random() * 1) + 2; // 200% to 300%
            break;

        case 2:
            if (randomValue < 0.3) return 0;
            else if (randomValue < 0.6) rewardMultiplier = (Math.random() * 0.4) + 0.1; // 10% to 50%
            else if (randomValue < 0.9) rewardMultiplier = (Math.random() * 0.5) + 1; // 100% to 150%
            else rewardMultiplier = (Math.random() * 3.5) + 2; // 200% to 550%
            break;

        case 3:
            if (randomValue < 0.4) return 0;
            else if (randomValue < 0.7) rewardMultiplier = (Math.random() * 0.4) + 0.1; // 10% to 50%
            else if (randomValue < 0.9) rewardMultiplier = (Math.random() * 0.5) + 1; // 100% to 150%
            else rewardMultiplier = (Math.random() * 6) + 2; // 200% to 800%
            break;

        default:
            console.log("Invalid round");
            return 0;
    }

    return parseFloat((INITIAL_BET * rewardMultiplier).toFixed(2));
}

function playgame(round = 1) {
    const reward = getReward(round);
    totalReward += reward;
    totalBets += INITIAL_BET;

    totalGame = totalWins + totalLosses;
    if (reward === 0 || round === 3) {
        if (reward === 0) {
            totalLosses++;
        }
        else {
            totalWins++;
        }

        if (totalGame < TOTAL_SIMULATIONS) {
            playgame();
        } else {
            houseEdge = (totalBets - totalReward) / totalBets;

            rl.close();
        }
    } else {
        playgame(round + 1);
    }
}



function playGame(round = 1, totalReward = 0) {
    const reward = getReward(round);
    totalReward += reward;

    console.log(`Round ${round} reward: ${reward}`);
    console.log(`Total reward: ${totalReward}`);

    if (reward === 0 || round === 3) {
        console.log('Game Over! Cashing out.');
        console.log(`Your total reward is: ${totalReward}`);
        rl.close();
        return;
    }

    rl.question('Do you want to continue and bet again? (yes/no) [default: yes] ', (answer) => {
        if (answer.toLowerCase() === '' || answer.toLowerCase() === 'yes') {
            playGame(round + 1, totalReward);
        } else {
            console.log(`You've decided to cash out. Your total reward is: ${totalReward}`);
            rl.close();
        }
    });

}

for (iteration = 0; iteration < 1000000; iteration++) {
    playgame()
    totalHouseEdge += houseEdge;
}
const averageHouseEdge = totalHouseEdge / 1000000;
console.log(`Average House Edge: ${(averageHouseEdge * 100).toFixed(2)}%`);
console.log(Math.pow(Math.random(), 1))