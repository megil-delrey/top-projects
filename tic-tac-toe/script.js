"use strict";

function createPlayer(name, marker) {
    let score = 0;

    const getName = () => name;
    
    const getMarker = () => marker;
    
    const getScore = () => score;
    
    function incrementScore() {
        score++;
    }
    
    return {getName, getMarker, getScore, incrementScore};
}


function createBoard() {
    const board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
    ];
    
    const getBoard = () => board.map(row => [...row]);
    
    function printBoard() {
        console.table(board);
    };
    
    function markCell(y, x, marker) {
        if (y === undefined || x === undefined || y < 0 || y > 2 || x < 0 || x > 2) {
            console.log("Invalid cell.");
            return false;
        }
        if (board[y][x]) {
            console.log("Cell already marked.");
            return false;
        }
        board[y][x] = marker;
        return true;
    }
    
    function getWinningMark() {
        const lines = [
            // rows
            [[0, 0], [0, 1], [0, 2]],
            [[1, 0], [1, 1], [1, 2]],
            [[2, 0], [2, 1], [2, 2]],
            // columns
            [[0, 0], [1, 0], [2, 0]],
            [[0, 1], [1, 1], [2, 1]],
            [[0, 2], [1, 2], [2, 2]],
            // diagonals
            [[0, 0], [1, 1], [2, 2]],
            [[0, 2], [1, 1], [2, 0]],
        ];
        for (const line of lines) {
            const [a, b, c] = line.map(([y, x]) => board[y][x]);
            if (a && a === b && b === c) {
                // console.log(a);
                return a;
            } 
        }
    }
    
    function reset() {
        board.forEach(row => {
            row.forEach((element, index) => {
                row[index] = "";
            })
        });
    }
    
    return {getBoard, printBoard, markCell, getWinningMark, reset};
}


function createGame(player1Name = "Player X", player2Name = "Player O") {
    const players = [createPlayer(player1Name, "X"), createPlayer(player2Name, "O")];
    const board = createBoard();

    let activePlayer = players[0];
    
    function switchActivePlayer() {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    function newTurn() {
        players.forEach(player => {
            console.log(`${player.getName()}: ${player.getScore()}`);
        });
        console.log(`${activePlayer.getName()}'s turn.`);
        board.printBoard();
    }

    function playTurn(y, x) {
        const markedCellSuccessfully = board.markCell(y, x, activePlayer.getMarker());
        if (!markedCellSuccessfully) {
            newTurn();
            return;
        }
        const winningMark = board.getWinningMark();
        if (winningMark) {
            const roundWinner = players.find(player => player.getMarker() === winningMark);
            roundWinner.incrementScore();
            if (roundWinner.getScore() === 2) {
                console.log(`${roundWinner.getName()} wins the match.`);
                return;   
            } else {
                console.log(`${roundWinner.getName()} wins the round.`);
                board.reset();
            }
        }
        switchActivePlayer();
        newTurn();
    }

    newTurn(); 

    return {playTurn};
};


let game = createGame();