import { GameBoard } from "./gameBoard.js";
import { GameController } from "./gameController.js";

const DisplayController = (() => {
  const form = document.querySelector("form");
  const isComputerCheckboxes = document.querySelectorAll(
    "input[type='checkbox']",
  );
  const main = document.querySelector("main");
  const cellButtons = document.querySelectorAll(".cell");
  const logP = document.querySelector(".log");
  const restartButton = document.querySelector(".restart-button");
  const newGameButton = document.querySelector(".new-game-button");

  // Event listeners start
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
      const player = {};
      const marker = playerInputsDiv.dataset.marker;
      const rawName = playerInputsDiv.querySelector(
        `#player-${marker}-name`,
      ).value
      player.name = rawName;
      player.marker = marker;
      if (playerInputsDiv.querySelector(`#is-${marker}-computer`).checked) {
        player.name += " (computer)";
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

  cellButtons.forEach((cell, index) => {
    cell.addEventListener("click", () => {
      playHumanTurn(index);
    });
  });

  restartButton.addEventListener("click", () => {
    restart();
  });

  newGameButton.addEventListener("click", () => {
    main.classList.add("hidden");
    form.classList.remove("hidden");
  });
  // Event listeners end

  function start(players) {
    GameController.setPlayers(players);
    GameController.start();
    form.classList.add("hidden");
    main.classList.remove("hidden");
    // fill in player info
    players.forEach((player) => {
      const playerInfoDiv = document.querySelector(
        `.player-info__${player.marker.toLowerCase()}`,
      );
      playerInfoDiv.querySelector(".name").textContent = player.name;
      playerInfoDiv.querySelector(".skill-level").textContent = player.isComputer
          ? `Skill level: ${capitalize(player.skillLevel)}`
          : "";
    });
    render();
    playComputerTurn();
  }

  function playHumanTurn(index) {
    if (
      GameController.getCurrentPlayer().isComputer() ||
      GameController.isGameOver()
    )
      return;
    GameController.playHumanTurn(index);
    render();
    playComputerTurn();
  }

  function playComputerTurn() {
    // console.log("playComputerTurn()");
    if (
      !GameController.getCurrentPlayer().isComputer() ||
      GameController.isGameOver()
    )
      return;
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
    } else {
      updateLog(`${GameController.getCurrentPlayer().getName()}'s turn.`);
    }
  }

  function restart() {
    GameController.start();
    render();
    playComputerTurn();
  }

  function renderBoard() {
    GameBoard.getBoard().forEach((mark, index) => {
      cellButtons[index].textContent = mark;
    });
  }

  function updateLog(message) {
    logP.textContent = message;
  }

  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return { start };
})();
