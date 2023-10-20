// const readline = require('readline');

// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });

let totalWins = 0;
let totalLosses = 0;
let totalReward = 0;
let totalGame = 0;
let game = 1;
const INITIAL_BET = 1;
const TOTAL_SIMULATIONS = 1;
let totalHouseEdge = 0;
let totalBets = 0;
let houseEdge = 0

let ROUND_NUMBER = 1;
// task : 
// R1 5% house edge
// R2 5% house edge
// R3 5% house edge



function getReward(round) {
    const randomValue = Math.random();

    let rewardMultiplier;
    // console.log("Starting round#",round);
    switch (round) {
        //eV = expected return,
        case 1: //House_Edge = 5.46%
            totalBets += INITIAL_BET;
            if (randomValue < 0.2) {
                ROUND_NUMBER = 0; return 0;
            }
            else if (randomValue < 0.5) {
                rewardMultiplier = (Math.random() * 0.5) + 0.4; // 40% to 90%
                ROUND_NUMBER = 2;
            }

            else if (randomValue < 0.8) {
                rewardMultiplier = (Math.random() * 0.8) + 1; // 100% to 180%
                ROUND_NUMBER = 2;
            }
            else {
                rewardMultiplier = (Math.random() * 0.35) + 1.8; // 18% to 215%
                ROUND_NUMBER = 2;
            }
            break;

        case 2:// HE =7.92%
            if (randomValue < 0.3) {
                ROUND_NUMBER = 0; return 0;
            }
            else if (randomValue < 0.5) {
                rewardMultiplier = (Math.random() * 0.4) + 0.3; // 40% to 90%
                ROUND_NUMBER = 3;
            }
            else if (randomValue < 0.85) {
                rewardMultiplier = (Math.random() * 1) + 1; // 100% to 200%
                ROUND_NUMBER = 3;
            }
            else {
                rewardMultiplier = (Math.random() * 0.75) + 2; // 200% to 275%
                ROUND_NUMBER = 3;
            }
            break;

        case 3://HE =9.5%
            if (randomValue < 0.4) {
                ROUND_NUMBER = 0; return 0;
            }
            else if (randomValue < 0.5) {
                rewardMultiplier = (Math.random() * 0.4) + 0.1; // 10% to 40%
                ROUND_NUMBER = 0;
            }
            else if (randomValue < 0.9) {
                rewardMultiplier = (Math.random() * 1) + 1.1; // 120% to 200%
                ROUND_NUMBER = 0;
            }
            else {
                rewardMultiplier = (Math.random() * 2) + 2; // 200% to 400% 
                ROUND_NUMBER = 0;
            }
            break;
        default:
            console.log("Invalid round");
            return 0;
    }

    // console.log("rewardMultiplier :", rewardMultiplier);
    return parseFloat((INITIAL_BET * rewardMultiplier).toFixed(2));
}

function main() {
    const loop = 100000;
    let result = 0;
    let endResult = 0;

    for (let i = 0; i < loop; i++) {
        do {
            result = getReward(ROUND_NUMBER);
        }
        while (ROUND_NUMBER > 0);
        ROUND_NUMBER = 1;
        endResult += result;
    }
    // console.log("endResult",endResult);
    const x = endResult/loop;

    console.log("expected return:",x)
    return;
}

function calculateValues(){
    const round1 =(0.2*0)+(0.3*((0.4+0.5)/2))+(0.3*((1+1.8)/2))+(0.2*((1.8+2.15)/2));
    const round2 =(0.3*0)+(0.2*((0.3+0.4)/2))+(0.35*((1+2)/2))+(0.15*((2+2.75)/2));
    const round3 =(0.4*0)+(0.1*((0.1+0.4)/2))+(0.4*((1.1+2)/2))+(0.1*((2+4)/2));
    console.log(round1); 
    console.log(round2);
    console.log(round3);
    const totalEv = round1*round2*round3
    console.log(totalEv)
    return;
}
calculateValues()
main()
// const y = 1 * (1- 0.05) * (1- 0.05) * (1- 0.05)
// console.log(y)



// function playgame(round = 1) {
//     const reward = getReward(round);

//     totalGame = totalWins + totalLosses;
//     if (reward === 0 || round === 3) {
//         if (reward === 0) {
//             totalLosses++;
//         }
//         else {
//             totalReward += reward;

//             totalWins++;
//         }

//         if (totalGame < TOTAL_SIMULATIONS) {
//             playgame();
//         } else {

//             totalBets -= 1;
//             totalGame = 0;
//             totalWins = 0;
//             totalLosses = 0;
//             houseEdge = (totalBets - totalReward) / totalBets;
//             rl.close();
//         }
//     } else {
//         playgame(round + 1);
//     }
// }



// for (iteration = 0; iteration < 1; iteration++) {
//     totalBets = 0;
//     totalReward = 0;
//     totalGame = 0;
//     playgame()
//     //     totalHouseEdge += houseEdge;
// }

// const averageHouseEdge = totalHouseEdge / 1000;
// console.log(`Average House Edge: ${(averageHouseEdge * 100).toFixed(2)}%`);