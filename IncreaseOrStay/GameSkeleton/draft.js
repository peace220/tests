function HouseEdge() {
    let initialBet = 1; // dollar
    let multiplier = 1;
    let loseMultiplier = 0;
    let expectedvalue = 0 //dollar/outcome == 1
    let wincon = 0.5
    let losecon = 0.5;
    let payout = 0;
    let reward = 1;
    for (i = 0; i < 5; i++) {
        payout = initialBet * multiplier;
        let win = (0.5 * (reward + payout)) // payout= 0.6 reward = previous win;
        let lost = (0.5 * (reward * loseMultiplier));
        reward += payout;
        expectedvalue = win + lost; // all possible outcome
        if (losecon <= 0.9) {
            losecon += 0.1;
        }
        if (wincon >= 0.2) {
            wincon -= 0.1;
        }

        const returnToCasino = initialBet - expectedvalue;

        const houseEdge = (returnToCasino / initialBet) * 100;
        console.log("inital bet =", initialBet, "Payout =", reward);
        console.log("house Edge = ", houseEdge)
        console.log("");
        initialBet = reward;
    }
}


function DoubleOrNothing() {
    let Chance = Math.floor((Math.random() * 100) + 1);
    let initialBet = 1;
    let multiplier = 2;
    let wincon = 50;
    console.log("User Inital Bet:", initialBet)
    for (i = 0; i < 5; i++) {
        if (Chance <= wincon) {
            Chance=Math.floor((Math.random() * 100) + 1);
            initialBet = initialBet * multiplier;

        } else {
            return console.log("User lost Bet at: ", initialBet,"       Lost!, Output Reward=0")
        }
    }
    return console.log("User Bet: ", initialBet,"       Win!, Output Reward= ", initialBet);
}


for (j = 0; j < 100; j++) {  
    DoubleOrNothing()
    console.log("");
}

// first bet 2 output, 2nd bet 3 output, 3rd bet 4 output