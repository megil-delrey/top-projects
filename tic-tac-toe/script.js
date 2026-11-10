"use strict";

function createPlayer(name, marker, isComputer = false) {
  const getName = () => name;

  const getMarker = () => marker;

  return {
    getName,
    getMarker,
    isComputer: () => isComputer,
  };
}

function createComputerPlayer(name, marker, skillLevel = 1) {
  const player = createPlayer(name, marker, true);

  const getEmptyCells = (board) =>
    board
      .map((cell, index) => (cell === "" ? index : null))
      .filter((index) => index !== null);

  const pickRandomCell = (emptyCells) =>
    emptyCells[Math.floor(Math.random() * emptyCells.length)];

  // const hasWon = (cells, marker) =>
  //     WIN_LINES.some(line => line.every(i => cells[i] === marker));

  // For each index of empty cells, mark that index in a copy of a board and test if that move triggered a win.
  const findWinningMove = (board, marker) =>
    getEmptyCells(board).find((index) => {
      const boardCopy = [...board];
      boardCopy[index] = marker;
      return GameBoard.hasWon(boardCopy, marker);
    });

  function chooseMove(board, opponentMarker) {
    if (Math.random() < skillLevel) {
      const win = findWinningMove(board, marker);
      if (win !== undefined) return win; // 1. win if possible
      const block = findWinningMove(board, opponentMarker);
      if (block !== undefined) return block; // 2. otherwise block
    }
    return pickRandomCell(getEmptyCells(board)); // 3. otherwise random
  }

  return { ...player, chooseMove };
}

const GameBoard = (() => {
  const board = ["", "", "", "", "", "", "", "", ""];
  const winningLines = [
    // rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // columns
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // diagonals
    [0, 4, 8],
    [2, 4, 6],
  ];
  let lastMark;

  const getBoard = () => [...board];

  function printBoard() {
    const TwoDBoard = []
    for (let i = 0; i < 9; i += 3) {
      const row = [];
      for (let j = 0; j < 3; j++) {
        row.push(board[i + j]);
      }
      TwoDBoard.push(row);
    }
    console.table(TwoDBoard);
  }

  function tryPlaceMark(index, mark) {
    if (index === undefined || index < 0 || index > 8) {
      return false;
    }
    if (board[index]) {
      return false;
    }
    board[index] = mark;
    lastMark = mark;
    return true;
  }

  function hasWon(board, mark) {
    return winningLines.some((line) =>
      line.every((index) => board[index] === mark),
    );
  }

  function isTie() {
    return board.every((cell) => cell !== "");
  }

  function getResult() {
    if (hasWon(board, lastMark)) return "win";
    if (isTie()) return "tie";
    return null;
  }

  function reset() {
    board.forEach((cell, index) => {
      board[index] = "";
    });
    lastMark = undefined;
  }

  return {
    getBoard,
    printBoard,
    tryPlaceMark,
    hasWon,
    getResult,
    reset,
  };
})();

const GameController = (() => {
  const players = [];
  let currentPlayer;
  let result = null;
  let isGameOver = false;

  const getPlayers = () => [...players];

  const getCurrentPlayer = () => currentPlayer;

  const getResult = () => result;

  function start(player1, player2) {
    if (player1.isComputer) {
      players[0] = createComputerPlayer(player1.name, "X", player1.skillLevel);
    } else {
      players[0] = createPlayer(player1.name, "X", false);
    }

    if (player2.isComputer) {
      players[1] = createComputerPlayer(player2.name, "O", player2.skillLevel);
    } else {
      players[1] = createPlayer(player2.name, "O", false);
    }
    restart();
    printTurn();
  }

  function switchCurrentPlayer() {
    currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    printTurn();
  }

  function playTurn(index) {
    if (isGameOver) return;
    if (!GameBoard.tryPlaceMark(index, currentPlayer.getMarker())) return;
    result = GameBoard.getResult();
    if (result) {
      isGameOver = true;
      printResult();
      return;
    }
    switchCurrentPlayer();
  }

  function playComputerTurn() {
    if (isGameOver || !currentPlayer.isComputer()) return;
    const opponent = currentPlayer === players[0] ? players[1] : players[0];
    playTurn(
      currentPlayer.chooseMove(GameBoard.getBoard(), opponent.getMarker()),
    );
  }

  function restart() {
    currentPlayer = players[0];
    result = null;
    isGameOver = false;
    GameBoard.reset();
  }

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
    isGameOver: () => isGameOver,
    start,
    playTurn,
    playComputerTurn,
    restart,
  };
})();

const DisplayController = (() => {
  const isComputerCheckboxes = document.querySelectorAll(
    "input[type='checkbox']",
  );
  const cellButtons = document.querySelectorAll(".cell");
  const messageP = document.querySelector(".message");
  const restartButton = document.querySelector(".restart");
  let isComputerThinking = false;

  isComputerCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      document
        .querySelector(`#${checkbox.dataset.for}`)
        .classList.toggle("hidden");
    });
  });

  cellButtons.forEach((cell, index) => {
    cell.addEventListener("click", () => {
      handleCellClick(index);
    });
  });

  restartButton.addEventListener("click", () => {
    restart();
  });

  function startGame() {
    document.querySelector("main").classList.remove("hidden");
    updateMessage(`${game.getActivePlayer().getName()}'s turn.`);
    document.querySelector(".player-x .name").textContent = game
      .getPlayers()[0]
      .getName();
    document.querySelector(".player-x .marker").textContent = game
      .getPlayers()[0]
      .getMarker();
    document.querySelector(".player-o .name").textContent = game
      .getPlayers()[1]
      .getName();
    document.querySelector(".player-o .marker").textContent = game
      .getPlayers()[1]
      .getMarker();
  }

  function handleCellClick(index) {
    if (isComputerThinking) return;
    game.playTurn(index);
    updateBoard();
    let message;
    if (game.isGameOver()) {
      message =
        game.getResult() === "win"
          ? `${game.getActivePlayer().getName()} wins.`
          : "Tie.";
      disableCells();
    } else {
      message = `${game.getActivePlayer().getName()}'s turn`;
    }
    updateMessage(message);
    maybeComputerPlaysTurn();
  }

  function maybeComputerPlaysTurn() {
    if (game.isGameOver()) return;
    const player = game.getActivePlayer();
    if (!player.isComputer()) return;
    isComputerThinking = true;
    setTimeout(() => {
      game.playTurn(
        player.chooseMove(GameBoard.getBoard(), player.getMarker()),
      );
    }, 500);
  }

  function restart() {
    game.restart();
    updateBoard();
    updateMessage(`${game.getActivePlayer().getName()}'s turn.`);
    enableCells();
  }

  function updateBoard() {
    GameBoard.getBoard().forEach((mark, index) => {
      cellButtons[index].textContent = mark;
    });
  }

  function updateMessage(message) {
    messageP.textContent = message;
  }

  function enableCells() {
    cellButtons.forEach((cell) => {
      cell.disabled = false;
    });
  }

  function disableCells() {
    cellButtons.forEach((cell) => {
      cell.disabled = true;
    });
  }

  return { startGame };
})();

GameController.start(
  { name: "Player X - Computer", isComputer: true, skillLevel: 1 },
  { name: "Player O" }
);
// DisplayController.startGame();
