function HouseEdge() {
    const initialBet = 1;
    let multiplier = 0.6;
    let loseMultiplier = 0.3;
    let ev = 0
    let wincon = 0.5
    let losecon = 0.5;
    let payout = 0;
    let reward = 1;
    for (i = 0; i < 5; i++) {
        payout = initialBet * multiplier;

        let win = (0.5 * (reward + payout))
        let lost = (0.5 * (reward * loseMultiplier));
        reward += payout;
        ev = win + lost;
        if (losecon <= 0.9) {
            losecon += 0.1;
        }
        if (wincon >= 0.2) {
            wincon -= 0.1;
        }
        const returnToCasino = initialBet - ev;
        const houseEdge = (returnToCasino / initialBet) * 100;
        console.log("expected Value= ",ev);
        console.log("Reward =", reward);
        console.log("Win =",win)
        console.log("lost =",lost)
        console.log("house Edge = ", houseEdge)
        console.log("");
    }


}

HouseEdge()