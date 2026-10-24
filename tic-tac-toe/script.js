"use strict";

function createPlayer(name, marker) {
    const getName = () => name;
    
    const getMarker = () => marker;
    
    return { getName, getMarker };
}


const board = (() => {
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
        const boardCopy = [];
        for (let i = 0; i < 9; i += 3) {
            boardCopy.push([board[i], board[i + 1], board[i + 2]]);
        } 
        console.table(boardCopy);
    };
    
    function tryMarkCell(index, mark) {
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
    
    function hasWon() {
        return winningLines.some(line => line.every(index => board[index] === lastMark));
    }

    function isTie() {
        return board.every(element => element !== "");
    }
    
    function getResult() {
        if (hasWon()) return "win";
        if (isTie()) return "tie";
        return null;
    }

    function reset() {
        board.forEach((element, index) => {
            board[index] = "";
        });
    }
    
    return { getBoard, printBoard, tryMarkCell, getResult, reset };
})();


function createGame(player1Name = "Player X", player2Name = "Player O") {
    const players = [createPlayer(player1Name, "X"), createPlayer(player2Name, "O")];
    let activePlayer = players[0];
    let result = null;
    let isGameOver = false;
    
    const getPlayers = () => players.map(player => ({...player}))

    const getActivePlayer = () => activePlayer;

    const getResult = () => result;

    const isOver = () => isGameOver;

    function switchActivePlayer() {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    function markCell(index) {
        if (isGameOver) return;
        if (!board.tryMarkCell(index, activePlayer.getMarker())) return;
        result = board.getResult();
        if (result) {
            isGameOver = true;
            return;
        }
        switchActivePlayer();
    }

    function restart() {
        board.reset()
        activePlayer = players[0];
        result = null;
        isGameOver = false;
    }    

    return {
        getPlayers, 
        getActivePlayer, 
        getResult,
        isOver,
        markCell, 
        restart 
    };
};


const displayController = (() => {
    const isComputerChkbxs = document.querySelectorAll("input[type='checkbox']");
    const cellBtns = document.querySelectorAll(".cell");
    const messageP = document.querySelector(".message");
    const restartButton = document.querySelector(".restart");

    isComputerChkbxs.forEach(chkbx => {
        chkbx.addEventListener("change", () => {
            document.querySelector(`#${chkbx.dataset.for}`).classList.toggle("hidden");
        });
    });

    cellBtns.forEach((cell, index) => {
        cell.addEventListener("click", () => {
            markCell(index);
        });
    })
    
    restartButton.addEventListener("click", () => {
        restart();
    });

    function init() {
        updateMessage(`${game.getPlayers()[0].getName()}'s turn.`);
        document.querySelector(".player-x .name").textContent = game.getPlayers()[0].getName();
        document.querySelector(".player-x .marker").textContent = game.getPlayers()[0].getMarker();
        document.querySelector(".player-o .name").textContent = game.getPlayers()[1].getName();
        document.querySelector(".player-o .marker").textContent = game.getPlayers()[1].getMarker();
    }

    function markCell(index) {
        game.markCell(index);
        updateBoard();
        let message;
        // const result = game.getResult();
        if (game.isOver()) {
            message = game.getResult() === "win"
                ? `${game.getActivePlayer().getName()} wins.`
                : "Tie.";
            disableCells();
        } else {
            message = `${game.getActivePlayer().getName()}'s turn`;
        }
        updateMessage(message);
    }

    function restart() {
        game.restart();
        updateBoard();
        updateMessage(`${game.getActivePlayer().getName()}'s turn.`);
        enableCells();
    }

    function updateBoard() {
        board.getBoard().forEach((mark, index) => {
            cellBtns[index].textContent = mark;
        })
    }

    function updateMessage(message) {
        messageP.textContent = message;
    }

    function enableCells() {
        cellBtns.forEach(cell => {
            cell.disabled = false;
        });
    }

    function disableCells() {
        cellBtns.forEach(cell => {
            cell.disabled = true;
        });
    }

    return { init };
})();


let game = createGame();
displayController.init();