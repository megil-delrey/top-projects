"use strict";

function createPlayer(name, marker) {
    const getName = () => name;
    
    const getMarker = () => marker;
    
    return { getName, getMarker };
}


const board = (() => {
    const board = ["X", "O", "", "", "", "X", "O", "", ""];
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
        const twoDboard = [];
        for (let i = 0; i < 9; i += 3) {
            twoDboard.push([board[i], board[i + 1], board[i + 2]]);
        } 
        console.table(twoDboard);
    };
    
    function markCell(index, mark) {
        if (index === undefined || index < 0 || index > 8) {
            console.log("Invalid cell.");
            return false;
        }
        if (board[index]) {
            console.log("Cell already marked.");
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
        return "ongoing";
    }

    function reset() {
        board.forEach((element, index) => {
            board[index] = "";
        });
    }
    
    return { getBoard, printBoard, markCell, getResult, reset };
})();


const displayController = (() => {
    function renderBoard() {
        const gridContainerDiv = document.createElement("div");
        gridContainerDiv.classList.add("grid-container");
        board.getBoard().forEach((element, index) => {
            const gridItemDiv = document.createElement("div");
            gridItemDiv.classList.add("grid-item");
            gridItemDiv.textContent = element;
            gridItemDiv.dataset.index = index;
            gridContainerDiv.appendChild(gridItemDiv);
        });
        document.querySelector(".board-container").appendChild(gridContainerDiv);
    }

    return { renderBoard };
})();


function createGame(player1Name = "Player X", player2Name = "Player O") {
    const players = [createPlayer(player1Name, "X"), createPlayer(player2Name, "O")];

    let activePlayer = players[0];
    
    function switchActivePlayer() {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    function newTurn() {
        // console.log(`${activePlayer.getName()}'s turn.`);
        displayController.renderBoard()
    }

    function playTurn(index) {
        const isCellMarkedSuccessfully = board.markCell(index, activePlayer.getMarker());
        if (!isCellMarkedSuccessfully) {
            newTurn();
            return;
        }
        const result = board.getResult();
        if (result === "win") {
            console.log(`${activePlayer.getName()} won.`);
            return;
        } else if (result === "tie") {
            console.log("Tie.");
            return;
        }
        switchActivePlayer();
        newTurn();
    }

    function reset() {
        board.reset()
        activePlayer = players[0];
    }

    newTurn(); 

    return { playTurn, reset };
};


let game = createGame();