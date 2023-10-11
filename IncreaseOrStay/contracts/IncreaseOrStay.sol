pragma solidity ^0.8.0;

contract IncreaseOrStay {
    enum GameState {
        Round1,
        Round2,
        Round3,
        Lost,
        Win,
        GameEnded
    }

    struct Game {
        address payable player;
        uint256 playerBet;
        uint256 reward;
        GameState currentState;
    }

    address payable public owner;
    uint256 public defaultMinBet;
    int256 public unclaimedBalance;

    event GameCreated(uint256 gameId);

    // gameId -> Game mapping
    mapping(uint256 => Game) public games;

    // Tracks the next game ID
    uint256 public nextGameId = 1;

    constructor(uint256 _defaultMinBet) payable {
        owner = payable(msg.sender);
        defaultMinBet = _defaultMinBet;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Ownable: caller is not the owner");
        _;
    }

    function createGame() public payable returns (uint256) {
        uint256 gameId = nextGameId++; // Reserve the current ID and then increment it for the next game.

        require(
            games[gameId].currentState == GameState.Round1,
            "create game - game state error"
        );
        require(
            msg.value >= defaultMinBet,
            "Please send more than default minimum bet to join the game"
        );
        address payable currentPlayer = payable(msg.sender);
        games[gameId] = Game({
            player: currentPlayer,
            playerBet: msg.value, // Default value
            reward: 0,
            currentState: GameState.Round1
        });

        emit GameCreated(gameId);
        return gameId;
    }

    receive() external payable {
        unclaimedBalance += int256(msg.value);
    }

    function setNextGameId(uint16 _nextGameId) external onlyOwner {
        require(_nextGameId > 0 && _nextGameId < nextGameId, "Invalid game ID");
        nextGameId = _nextGameId;
    }

    function ownerWithdraw(uint256 amount) external onlyOwner {
        require(
            address(this).balance >= amount,
            "Insufficient contract balance"
        );
        unclaimedBalance -= int256(amount); // Subtract the withdrawn amount from the unclaimed balance
        owner.transfer(amount);
    }

    function _withdraw(address payable player, uint256 amount) private {
        unclaimedBalance += int256(amount);
        player.transfer(amount);
    }

    function getReward(uint256 gameId) internal returns (uint256) {
        Game storage game = games[gameId];
        require(game.currentState != GameState.GameEnded, "Game Ended");
        uint256 InitialBet = game.playerBet;
        uint256 randomValue = uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, blockhash(block.number - 1)))) % 100;
        uint256 rewardMultiplier;
        if(game.currentState == GameState.Round1){
            if (randomValue < 20) {
                game.currentState = GameState.Lost;
                return 0;
            }
            else if (randomValue < 50) rewardMultiplier = (randomValue % 51 + 40) * 10; // 40% to 90%
            else if (randomValue < 90) rewardMultiplier = (randomValue % 51 + 100) * 10; // 100% to 150%
            else rewardMultiplier = (randomValue % 101 + 200) * 10; // 200% to 300%

            game.currentState = GameState.Round2;
        }else if (game.currentState == GameState.Round2) {
            if (randomValue < 30){
                game.currentState = GameState.Lost;
                return 0;
            }
            else if (randomValue < 60) rewardMultiplier = (randomValue % 41 + 10) * 10; // 10% to 50%
            else if (randomValue < 90) rewardMultiplier = (randomValue % 51 + 100) * 10; // 100% to 150%
            else rewardMultiplier = (randomValue % 301 + 300) * 10; // 300% to 600%

            game.currentState = GameState.Round3;
        }else if (game.currentState == GameState.Round3) {
            if (randomValue < 40) {
                game.currentState = GameState.Lost;
                return 0;
            }
            else if (randomValue < 70) rewardMultiplier = (randomValue % 41 + 10) * 10; // 10% to 50%
            else if (randomValue < 90) rewardMultiplier = (randomValue % 51 + 100) * 10; // 100% to 150%
            else rewardMultiplier = (randomValue % 301 + 300) * 10; // 300% to 600%
            game.currentState = GameState.Win;
        }

        return (InitialBet * rewardMultiplier) / 1000;
    }

    function playGame(uint256 gameId) public payable{
        Game storage game = games[gameId];
        require(game.currentState != GameState.GameEnded, "Game Ended");
        require(gameId < nextGameId, "Invalid game ID");
        uint256 reward = getReward(gameId);
        game.reward += reward;
        if(game.currentState == GameState.Lost || game.currentState == GameState.Win){
            game.currentState = GameState.GameEnded;
            payable(game.player).transfer(game.reward);
        }
    }


    function Withdraw(uint256 gameId) public {
        Game storage game = games[gameId];
        require(gameId < nextGameId, "Invalid game ID");
        require(game.currentState != GameState.GameEnded, "Game Ended");

        game.currentState = GameState.GameEnded;
        payable(game.player).transfer(game.reward);
    }
}
