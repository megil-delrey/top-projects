const gameboard = function() {
    const board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
    ];

    const getBoard = () => board;

    const markCell = (x, y, player) => {
        if (x < 0 || x > 2 || y < 0 || y > 2) {
            console.log("Invalid cell.");
            return false;
        }
        if (board[x][y]) {
            console.log("Cell already marked.");
            return false;
        }
        board[x][y] = player.marker;
        return true;
    }

    return { getBoard, markCell: markCell };
}();


function createGame (playerOneName = "Player 1", playerTwoName = "Player 2") {
    const players = [
        {name: playerOneName, score: 0, marker: "x"},
        {name: playerTwoName, score: 0, marker: "o"},
    ];

    let activePlayer = players[0];
    
    const switchActivePlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const newTurn = () => {
        console.log(`${activePlayer.name}'s turn.`);
        console.log(gameboard.getBoard());
    }

    const checkForWinner = () => {
        // Check in rows
        for(let i = 0; i < 3; i++) {
            let lastMarker;
            for(let j = 1; j < 3; j++) {
                const mark = gameboard.getBoard()[i][j];
                if (mark === "" || mark !== lastMarker) {
                    break;
                }
                if (mark === lastMarker && j === 2) {
                    return players.find(player => mark === player.marker);
                }
                lastMarker = mark;
            }
        }
    }

    const playTurn = (x, y) => {
        const markedCellSuccessfully = gameboard.fillCell(x, y, activePlayer);
        if (!markedCellSuccessfully) {
            newTurn();
            return;
        }
        if (checkForWinner()) {
            return;
        }
        switchActivePlayer();
        newTurn();
    }

    newTurn(); 

    return {playTurn};
};


const game = createGame();