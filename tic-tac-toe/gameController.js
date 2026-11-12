import { createPlayer, createComputerPlayer } from "./players.js";
import { GameBoard } from "./gameBoard.js";

const GameController = (() => {
  const players = [];
  let currentPlayer;
  let result;
  let isGameOver;

  const getPlayers = () => [...players];

  const getCurrentPlayer = () => currentPlayer;

  const getResult = () => result;

  function setPlayers(playersParam) {
    playersParam.forEach((player, index) => {
      const marker = player.marker.toUpperCase();
      players[index] = player.isComputer
        ? createComputerPlayer(player.name, marker, player.skillLevel)
        : createPlayer(player.name, marker, false);
    });
  }

  function start() {
    currentPlayer = players[0];
    result = undefined;
    isGameOver = false;
    GameBoard.reset();
    // printTurn();
  }

  function switchCurrentPlayer() {
    currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    // printTurn();
  }

  function playHumanTurn(index) {
    if (currentPlayer.isComputer()) return;
    playTurn(index);
  }

  function playComputerTurn() {
    if (!currentPlayer.isComputer()) return;
    const opponent = currentPlayer === players[0] ? players[1] : players[0];
    playTurn(
      currentPlayer.chooseMove(GameBoard.getBoard(), opponent.getMarker()),
    );
  }

  function playTurn(index) {
    if (isGameOver) return;
    if (!GameBoard.placeMark(index, currentPlayer.getMarker())) return;
    result = GameBoard.getResult();
    if (result) {
      isGameOver = true;
      // printResult();
      return;
    }
    switchCurrentPlayer();
  }

  // console only functions below

  function printTurn() {
    console.log(`${currentPlayer.getName()}'s turn.`);
    GameBoard.printBoard();
  }

  function printResult() {
    if (result === "win") {
      console.log(`${currentPlayer.getName()} wins.`);
    } else if (result === "tie") {
      console.log("Tie.");
    }
    GameBoard.printBoard();
  }

  return {
    getPlayers,
    getCurrentPlayer,
    getResult,
    setPlayers,
    isGameOver: () => isGameOver,
    start,
    playHumanTurn,
    playComputerTurn,
  };
})();

export { GameController };
