pragma solidity ^0.8.0;

contract IncreaseOrStay {
    enum GameState {
        NewGame,
        Increase,
        GameEnded
    }

    struct Game {
        address payable player;
        uint256 playerBet;
        uint256 minimumBet;
        uint256 winningCondition;
        uint256 multiplier;
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
            games[gameId].currentState == GameState.NewGame,
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
            minimumBet: msg.value,
            winningCondition: 60;
            multiplier: 0.2;
            reward: msg.value;
            currentState: GameState.NewGame
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

    function IncreaseReward(uint256 gameId) public {
        Game storage game = games[gameId];
        require(gameId < nextGameId, "Invalid game ID");
        require(game.currentState == GameState.NewGame, "Game Ended")

        uint256 randomNumber = uint256(keccak256(abi.encodePacked(block.timestamp, blockhash(block.number - 1))));
        uint256 rolledNumber = (randomNumber % 10001) / 100;

        if (rolledNumber <= game.winningCondition) {
            uint256 winnings = currentBet * (multiplier - 1);
            playerBalance += winnings;
            emit GameResult(msg.sender, currentBet, true, winnings, playerBalance);
        } else {
            playerBalance -= currentBet;
            emit GameResult(msg.sender, currentBet, false, 0, playerBalance);
        }
    }

    function EndGame(uint256 gameId) public {
        Game storage game = games[gameId];
        require(gameId < nextGameId, "Invalid game ID");
        require(game.currentState == GameState.NewGame, "Game Ended")

        game.currentState = GameState.GameEnded
        payable(game.player).transfer(game.reward);
    }
}
