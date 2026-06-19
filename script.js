let humanScore = 0;
let computerScore = 0;
const beatsWhat = {
    "rock": "scissors",
    "paper": "rock",
    "scissors": "paper"
}
const buttons = document.querySelectorAll("button");
const humanScorePara = document.querySelector("#human-score");
const computerScorePara = document.querySelector("#computer-score");
const log1 = document.querySelector("#log-1");
const log2 = document.querySelector("#log-2");
const log3 = document.querySelector("#log-3");


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

function playRound(humanChoice, computerChoice) {
    log1.textContent = `You chose ${humanChoice}, computer chose ${computerChoice}`;    
    if (humanChoice === computerChoice) {
        log2.textContent = "Tie!";
    } else if (beatsWhat[humanChoice] === computerChoice) {
        log2.textContent = `You win! ${humanChoice} beats ${computerChoice}`;
        humanScorePara.textContent = `human: ${++humanScore}`;
    } else {
        log2.textContent = `You lost! ${computerChoice} beats ${humanChoice}`;
        computerScorePara.textContent = `computer: ${++computerScore}`;
    }

    if (humanScore === 5 || computerScore === 5) {
        buttons.forEach((button) => button.disabled = true);
        if (humanScore === 5) {
            log3.textContent = "You won!";
            log3.style.backgroundColor = "lime";
        } else {
            log3.textContent = "You lost!";
            log3.style.backgroundColor = "pink";
        }
    }
    
}
    
for (const button of buttons) {
    button.addEventListener("click", (e) => playRound(e.target.id, getComputerChoice()))
}