function getComputerChoice() {
    let num = Math.floor(Math.random() * 3) + 1;
    switch (num) {
        case 1:
            return "rock";
        case 2:
            return "paper";
        case 3:
            return "scissors"
    }
}

function getHumanChoice() {
    let choice = prompt("Choose between rock, paper, and scissors").toLocaleLowerCase();
    return choice;
}


function playGame() {
    function playRound(humanChoice, computerChoice) {
        //console.log(humanChoice);
        if (humanChoice === "rock") {
            if (computerChoice === "rock") {
                console.log("Tie!");
            } else if (computerChoice === "paper") {
                console.log("You lose! paper beats rock");
                computerScore++;
            } else if (computerChoice === "scissors") {
                console.log("You win! rock beats scissors");
                humanScore++;
            }
        } else if (humanChoice === "paper") {
            if (computerChoice === "paper") {
                console.log("Tie!")
            } else if (computerChoice === "scissors") {
                console.log("You lose! scissors beats paper");
                computerScore++;
            } else if (computerChoice === "rock") {
                console.log("You win! paper beats rock");
                humanScore++;
            }
        } else if (humanChoice === "scissors") {
            if (computerChoice === "scissors") {
                console.log("Tie!")
            } else if (computerChoice === "rock") {
                console.log("You lose! rock beats scissors");
                computerScore++;
            } else if (computerChoice === "paper") {
                console.log("You win! scissors beats paper");
                humanScore++;
            }
        }
    }
    let humanScore = 0;
    let computerScore = 0;
    for (let i = 0; i < 5; i++) {
        playRound(getHumanChoice(), getComputerChoice());
    }
    if (humanScore > computerScore) {
        console.log("You won the game!");
    } else if (humanScore < computerScore) {
        console.log("You lost the game!")
    } else {
        console.log("The game is tied!")
    }
}

playGame();