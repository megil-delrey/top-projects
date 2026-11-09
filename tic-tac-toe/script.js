"use strict";

function createPlayer(name, marker, isComputer = false) {
    const getName = () => name;
    
    const getMarker = () => marker;
    
    return { 
        getName, 
        getMarker,
        isComputer: () => isComputer
    };
}

function createComputerPlayer(name, marker, skillLevel = 1) {
    const player = createPlayer(name, marker, true);
    
    const getEmptyCells = (board) =>
        board.map((cell, index) => cell === "" ? index : null).filter((index) => index !== null);

    const pickRandomCell = (emptyCells) => emptyCells[Math.floor(Math.random() * emptyCells.length)];

    // const hasWon = (cells, marker) =>
    //     WIN_LINES.some(line => line.every(i => cells[i] === marker));

    // For each index of empty cells, mark that index in a copy of a board and test if that move triggered a win.
    const findWinningMove = (board, marker) =>
        getEmptyCells(board).find((index) => {
            const boardCopy = [...board];
            boardCopy[index] = marker;
            return board.hasWon(boardCopy, marker);
        });

    function chooseMove(board, oppMarker){
        if (Math.random() < skillLevel) {
            const win = findWinningMove(board, marker);
            if (win !== undefined) return win;        // 1. win if possible
            const block = findWinningMove(board, oppMarker);
            if (block !== undefined) return block;    // 2. otherwise block
        }
        return pickRandomCell(getEmptyCells(board));       // 3. otherwise random
    }

    return { ...player, chooseMove };
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
        console.table([...board]);
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
    
    function hasWon(board = board, mark = lastMark) {
        return winningLines.some(line => line.every(index => board[index] === mark));
    }

    function isTie() {
        return board.every(cell => cell !== "");
    }
    
    function getResult() {
        if (hasWon()) return "win";
        if (isTie()) return "tie";
        return null;
    }

    function reset() {
        board.forEach((cell, index) => {
            board[index] = "";
        });
    }
    
    return { 
        getBoard, 
        printBoard, 
        tryMarkCell,
        hasWon,
        getResult, 
        reset 
    };
})();


function createGame(player1Name = "Player X", player2Name = "Player O") {
    const players = [createPlayer(player1Name, "X"), createPlayer(player2Name, "O")];
    let activePlayer = players[0];
    let result = null;
    let isGameOver = false;
    
    const getPlayers = () => players.map(player => ({...player}))

    const getActivePlayer = () => activePlayer;

    const getResult = () => result;

    function switchActivePlayer() {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    function playTurn(index) {
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
        isGameOver: () => isGameOver,
        playTurn, 
        restart 
    };
};


const displayController = (() => {
    const isComputerCheckboxes = document.querySelectorAll("input[type='checkbox']");
    const cellButtons = document.querySelectorAll(".cell");
    const messageP = document.querySelector(".message");
    const restartButton = document.querySelector(".restart");
    let isComputerThinking = false;

    isComputerCheckboxes.forEach(checkbox => {
        checkbox.addEventListener("change", () => {
            document.querySelector(`#${checkbox.dataset.for}`).classList.toggle("hidden");
        });
    });

    cellButtons.forEach((cell, index) => {
        cell.addEventListener("click", () => {
            handleCellClick(index);
        });
    })
    
    restartButton.addEventListener("click", () => {
        restart();
    });

    function startGame() {
        document.querySelector("main").classList.remove("hidden");
        updateMessage(`${game.getActivePlayer().getName()}'s turn.`);
        document.querySelector(".player-x .name").textContent = game.getPlayers()[0].getName();
        document.querySelector(".player-x .marker").textContent = game.getPlayers()[0].getMarker();
        document.querySelector(".player-o .name").textContent = game.getPlayers()[1].getName();
        document.querySelector(".player-o .marker").textContent = game.getPlayers()[1].getMarker();
    }

    function handleCellClick(index) {
        if (isComputerThinking) return;
        game.playTurn(index);
        updateBoard();
        let message;
        if (game.isGameOver()) {
            message = game.getResult() === "win"
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
            game.playTurn(player.chooseMove(board.getBoard(), player.getMarker(), ))
        }, 500);
    }

    function restart() {
        game.restart();
        updateBoard();
        updateMessage(`${game.getActivePlayer().getName()}'s turn.`);
        enableCells();
    }

    function updateBoard() {
        board.getBoard().forEach((mark, index) => {
            cellButtons[index].textContent = mark;
        })
    }

    function updateMessage(message) {
        messageP.textContent = message;
    }

    function enableCells() {
        cellButtons.forEach(cell => {
            cell.disabled = false;
        });
    }

    function disableCells() {
        cellButtons.forEach(cell => {
            cell.disabled = true;
        });
    }

    return { startGame };
})();


let game = createGame();
displayController.startGame();