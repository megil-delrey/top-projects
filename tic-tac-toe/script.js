function createPlayer(name, marker) {
    let name = name;
    let marker = marker;
    const getName = () => name;
    const getMarker = () => marker;
    return {getName, getMarker};
}


const board = function() {
    const board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
    ];

    const printBoard = () => {
        console.log(board);
    };

    const markCell = (y, x, marker) => {
        if (x < 0 || x > 2 || y < 0 || y > 2) {
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

    const getWinningMark = () => {
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
                return players.find(player => player.marker === a);
            } else {
                return;
            }
        }
    }

    return {printBoard, markCell, getWinningMark};
}();


function createGame (player1Name = "Player 1", player2Name = "Player 2") {
    const players = [createPlayer(player1Name), createPlayer(player2Name)];

    let activePlayer = players[0];
    
    const switchActivePlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const newTurn = () => {
        console.log(`${activePlayer.getName()}'s turn.`);
        board.printBoard();
    }

    const playTurn = (y, x) => {
        const markedCellSuccessfully = board.fillCell(y, x, activePlayer.getMarker());
        if (!markedCellSuccessfully) {
            newTurn();
            return;
        }
        const winningMark = board.getWinningMark();
        if (winningMark) {
            
        }
        switchActivePlayer();
        newTurn();
    }

    newTurn(); 

    return {playTurn};
};


const game = createGame();