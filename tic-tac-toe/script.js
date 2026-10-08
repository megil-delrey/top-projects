const gameboard = function() {
    const board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
    ];
    const getBoard = () => board;
    const fillCell = (x, y, player) => {
        if (x < 0 || x > 2 || y < 0 || y > 2) {
            console.log("Invalid cell.");
            return false;
        }
        if (board[x][y]) {
            console.log("Cell already filled.");
            return false;
        }
        board[x][y] = player.marker;
        return true;
    }
    return { getBoard, fillCell };
}();


const game = function(playerOneName = "Player 1", playerTwoName = "Player 2") {
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

    }
    const playTurn = (x, y) => {
        const filledCellSuccessfully = gameboard.fillCell(x, y, activePlayer);
        if (!filledCellSuccessfully) {
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
}();