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
    return;
  }

  function reset() {
    board.forEach((cell, index) => {
      board[index] = "";
    });
    lastMark = undefined;
  }

  // console only functions below

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

  return {
    getBoard,
    printBoard,
    placeMark,
    hasWon,
    getResult,
    reset,
  };
})();

export { GameBoard };