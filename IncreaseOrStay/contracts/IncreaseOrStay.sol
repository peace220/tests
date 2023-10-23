import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
pragma solidity ^0.8.0;

contract IncreaseOrStay is ReentrancyGuard {
    using SafeMath for uint256;
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
        uint256 checkForBalance = msg.value * 10;
        require(
            checkForBalance <= address(this).balance,
            "Contract does not have enough Ether"
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
        bytes32 randomHash = keccak256(abi.encodePacked(blockhash(block.number - 1), block.timestamp, block.number));
        uint256 randomValue = uint256(keccak256(abi.encodePacked(block.timestamp,block.difficulty,blockhash(block.number - 1)))) % 101;
        uint256 rewardMultiplier;
        uint256 number = uint(randomHash)%1001;
        if (game.currentState == GameState.Round1) {
            if (randomValue < 20) {
                game.currentState = GameState.Lost;
                return 0;
            } else if (randomValue < 50){ 
                uint256 squaredValue = (number**2)/1000;
                rewardMultiplier = squaredValue; //0 to 1
            }
            else if (randomValue < 80){
                uint256 cubedValue = (number**3)/1000000;
                rewardMultiplier = cubedValue + 1000; //1 to 2
            }
            else{
                uint256 quadValue = (number**4)/1000000000;
                rewardMultiplier = 2000+ quadValue ; //2 to 3
            } 

            game.currentState = GameState.Round2;
        } else if (game.currentState == GameState.Round2) {
            if (randomValue < 20) {
                game.currentState = GameState.Lost;
                return 0;
            } else if (randomValue < 50){
                uint256 squaredValue = (number**2)/1000;
                rewardMultiplier = squaredValue; //0 to 1
            }
            else if (randomValue < 80){
                uint256 squaredValue = (number**2)/1000;
                rewardMultiplier = squaredValue + 1000; //1 to 2
            }
            else{
                uint256 cubedValue = (number**3)/1000000;
                rewardMultiplier = cubedValue*4 + 2000; //2 to 6
            } 

            game.currentState = GameState.Round3;
        } else if (game.currentState == GameState.Round3) {
            if (randomValue < 20) {
                game.currentState = GameState.Lost;
                return 0;
            } else if (randomValue < 50){
                uint256 squaredValue = (number**2)/1000;
                rewardMultiplier = squaredValue; //0 to 1
            }
            else if (randomValue < 80){
                uint256 squaredValue = (number**2)/1000;
                rewardMultiplier = squaredValue + 1000; //1 to 2
            }
            else {
                uint256 cubedValue = (number**3)/1000000;
                rewardMultiplier = cubedValue*8 + 2000; //2 to 10
            } 
            game.currentState = GameState.Win;
        }

        return (InitialBet * rewardMultiplier) / 1000; // make the multiplier to included "decimal"
    }

    function playGame(uint256 gameId) public payable {
        Game storage game = games[gameId];
        require(game.currentState != GameState.GameEnded, "Game Ended");
        require(gameId < nextGameId, "Invalid game ID");
        require(msg.sender == game.player, "Not the Same Player");
        uint256 reward = getReward(gameId);
        game.reward = reward;
        if (
            game.currentState == GameState.Lost ||
            game.currentState == GameState.Win
        ) {
            game.currentState = GameState.GameEnded;
            payable(game.player).transfer(game.reward);
        }
    }

    function Withdraw(uint256 gameId) public nonReentrant{
        Game storage game = games[gameId];
        require(gameId < nextGameId, "Invalid game ID");
        require(game.currentState != GameState.GameEnded, "Game Ended");
        require(msg.sender == game.player, "Not the Same Player");

        game.currentState = GameState.GameEnded;
        payable(game.player).transfer(game.reward);
    }
}
