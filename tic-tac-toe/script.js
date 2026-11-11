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

function createComputerPlayer(name, marker, skillLevel = "high") {
  const player = createPlayer(name, marker, true);

  const numericSkillLevel = {
    low: 0.5,
    medium: 0.75,
    high: 1,
  };

  const getSkillLevel = () => skillLevel;

  const getEmptyCells = (board) =>
    board
      .map((cell, index) => (cell === "" ? index : null))
      .filter((index) => index !== null);

  const pickRandomEmptyCell = (emptyCells) =>
    emptyCells[Math.floor(Math.random() * emptyCells.length)];

  // For each index of empty cells, mark that index in a copy of a board and test if that move triggered a win.
  const findWinningMove = (board, marker) =>
    getEmptyCells(board).find((index) => {
      const boardCopy = [...board];
      boardCopy[index] = marker;
      return GameBoard.hasWon(boardCopy, marker);
    });

  function chooseMove(board, opponentMarker) {
    if (Math.random() < numericSkillLevel[skillLevel]) {
      const win = findWinningMove(board, marker);
      if (win !== undefined) return win; // 1. win if possible
      const block = findWinningMove(board, opponentMarker);
      if (block !== undefined) return block; // 2. otherwise block
    }
    return pickRandomEmptyCell(getEmptyCells(board)); // 3. otherwise random
  }

  return { ...player, getSkillLevel, chooseMove };
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
    const TwoDBoard = [];
    for (let i = 0; i < 9; i += 3) {
      const row = [];
      for (let j = 0; j < 3; j++) {
        row.push(board[i + j]);
      }
      TwoDBoard.push(row);
    }
    console.table(TwoDBoard);
  }

  function placeMark(index, mark) {
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
    placeMark,
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
    reset();
    printTurn();
  }

  function switchCurrentPlayer() {
    currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    printTurn();
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
      printResult();
      return;
    }
    switchCurrentPlayer();
  }

  function reset() {
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
    playHumanTurn,
    playComputerTurn,
    reset,
  };
})();

const DisplayController = (() => {
  const form = document.querySelector("form");
  const isComputerCheckboxes = document.querySelectorAll(
    "input[type='checkbox']",
  );
  const main = document.querySelector("main");
  const startButton = document.querySelector(".start-button");
  const cellButtons = document.querySelectorAll(".cell");
  const logP = document.querySelector(".log");
  const restartButton = document.querySelector(".restart-button");
  const newGameButton = document.querySelector(".new-game-button");

  isComputerCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      document
        .querySelector(`#${checkbox.dataset.for}`)
        .classList.toggle("hidden");
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const players = [];
    const playersInputsDiv = document.querySelectorAll(".player-inputs");
    playersInputsDiv.forEach((playerInputsDiv) => {
      const marker = playerInputsDiv.dataset.marker;
      const player = {};
      player.name = playerInputsDiv.querySelector(
        `#player-${marker}-name`,
      ).value;
      if (playerInputsDiv.querySelector(`#is-${marker}-computer`).checked) {
        player.isComputer = true;
        player.skillLevel = playerInputsDiv.querySelector(
          `input[name="${marker}-skill-level"]:checked`,
        ).value;
      }
      players.push(player);
    });
    form.reset();
    // hide skill level selector
    isComputerCheckboxes.forEach((checkbox) => {
      document
        .querySelector(`#${checkbox.dataset.for}`)
        .classList.add("hidden");
    });
    start(players);
  });

  function start(players) {
    GameController.start(...players);
    form.classList.add("hidden");
    main.classList.remove("hidden");
    GameController.getPlayers().forEach((player) => {
      const playerInfoDiv = document.querySelector(
        `.player-info__${player.getMarker().toLowerCase()}`,
      );
      playerInfoDiv.querySelector(".name").textContent = player.getName();
      if (player.isComputer()) {
        playerInfoDiv.querySelector(".skill-level").textContent = 
          `Skill level: ${capitalize(player.getSkillLevel())}`;
      }
    });
    render();
    if (GameController.getCurrentPlayer().isComputer()) {
      playComputerTurn();
    }
  }

  cellButtons.forEach((cell, index) => {
    cell.addEventListener("click", () => {
      playHumanTurn(index);
    });
  });

  restartButton.addEventListener("click", () => {
    reset();
  });

  newGameButton.addEventListener("click", () => {
    GameController.reset();
    enableCells();
    main.classList.add("hidden");
    form.classList.remove("hidden");
  });

  function playHumanTurn(index) {
    if (GameController.getCurrentPlayer().isComputer()) return;
    GameController.playHumanTurn(index);
    render();
    playComputerTurn();
  }

  function playComputerTurn() {
    if (!GameController.getCurrentPlayer().isComputer()) return;
    setTimeout(() => {
      GameController.playComputerTurn();
      render();
      playComputerTurn();
    }, 1000);
  }

  function render() {
    renderBoard();
    if (GameController.isGameOver()) {
      updateLog(
        GameController.getResult() === "win"
          ? `${GameController.getCurrentPlayer().getName()} wins.`
          : "Tie.",
      );
      disableCells();
      return;
    } else {
      updateLog(`${GameController.getCurrentPlayer().getName()}'s turn.`);
    }
  }

  function reset() {
    GameController.reset();
    renderBoard();
    updateLog(`${GameController.getCurrentPlayer().getName()}'s turn.`);
    enableCells();
  }

  function renderBoard() {
    GameBoard.getBoard().forEach((mark, index) => {
      cellButtons[index].textContent = mark;
    });
  }

  function updateLog(message) {
    logP.textContent = message;
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

  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return { start };
})();

// DisplayController.start();

// const Person = (() => {
//   let name = "John";
//   const getName = () => name;
//   return { name, getName };
// })();
