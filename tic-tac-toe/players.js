import { GameBoard } from "./gameBoard.js";

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

  const numericSkillLevels = {
    low: 0.33,
    medium: 0.67,
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
    const randomNum = Math.random();
    // console.log(
    //   `${randomNum} < ${numericSkillLevels[skillLevel]}`
    // );
    if (randomNum < numericSkillLevels[skillLevel]) {
      const win = findWinningMove(board, marker);
      if (win !== undefined) return win; // 1. win if possible
      const block = findWinningMove(board, opponentMarker);
      if (block !== undefined) return block; // 2. otherwise block
    }
    // console.log("random!")
    return pickRandomEmptyCell(getEmptyCells(board)); // 3. otherwise random
  }

  return { ...player, getSkillLevel, chooseMove };
}

export { createPlayer, createComputerPlayer };
