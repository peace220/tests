let ROUND_NUMBER = 1;

function getReward(round) {
    const randomValue = Math.random();

    let rewardMultiplier;
    // console.log("Starting round#",round);
    switch (round) {
        case 1: // H_E: ~10%
            if (randomValue < 0.2) {
                // 0
                ROUND_NUMBER = 0; return 0;
            }
            else if (randomValue < 0.5) {
                // 0 to 1
                rewardMultiplier = Math.pow(Math.random(), 2) * 1;
                ROUND_NUMBER = 2;
            }
            else if (randomValue < 0.8) {
                // 1 to 2
                rewardMultiplier = 1 + Math.pow(Math.random(), 3) * 1;
                ROUND_NUMBER = 2;
            }
            else {
                // 2 to 3
                rewardMultiplier = 2 + Math.pow(Math.random(), 4) * 1;
                ROUND_NUMBER = 2;
            }
            break;

        case 2:  // H_E: 12%
            if (randomValue < 0.2) {
                // 0
                ROUND_NUMBER = 0; return 0;
            }
            else if (randomValue < 0.5) {
                // 0 to 1
                rewardMultiplier = Math.pow(Math.random(), 2) * 1;
                ROUND_NUMBER = 0;
            }
            else if (randomValue < 0.8) {
                // 1 to 2
                rewardMultiplier = 1 + Math.pow(Math.random(), 2) * 1;
                ROUND_NUMBER = 0;
            }
            else {
                // 2 to 6
                rewardMultiplier = 2 + Math.pow(Math.random(), 3) * 4;
                ROUND_NUMBER = 0;
            }
            break;

        case 3: // 16%
            if (randomValue < 0.2) {
                // 0
                ROUND_NUMBER = 0; return 0;
            }
            else if (randomValue < 0.5) {
                // 0 to 1
                rewardMultiplier = Math.pow(Math.random(), 2) * 1;
                ROUND_NUMBER = 0;
            }
            else if (randomValue < 0.8) {
                // 1 to 2
                rewardMultiplier = 1 +  Math.pow(Math.random(), 2)*1;
                ROUND_NUMBER = 0;
            }
            else {
                // 2 to 10
                rewardMultiplier =2 + Math.pow(Math.random(), 3) * 8;
                ROUND_NUMBER = 0;
            }
            break;
        default:
            console.log("Invalid round");
            return 0;
    }

    // console.log("rewardMultiplier :", rewardMultiplier);
    return parseFloat((1 * rewardMultiplier).toFixed(2));
}

function main() {
    const loop = 300;
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
    const x = endResult / loop;
    
    console.log("expected return: Round 3", x)
    return;
}
main()
// const LOOP = 5;
// for (let i=0; i<LOOP;i++){
//     y =   4 + Math.pow(Math.random(), 2) * 1;
//     console.log(y);
// }
