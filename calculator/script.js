const expressionDiv = document.querySelector(".expression");
const valueDiv = document.querySelector(".value");
const digitButtons = document.querySelectorAll(".digit");
const decimalPointButton = document.querySelector(".decimal-point");
const operatorButtons = document.querySelectorAll(".operator");
const equalsButton = document.querySelector(".equals");
const clearButton = document.querySelector(".clear");
const backspaceButton = document.querySelector(".backspace");

let firstNumber = "";
let operator = "";
let secondNumber = "";
let shouldClearExpression = false;
let shouldResetDisplayValue = false;
let dividedByZero = false;


// ----------------
// Helper functions
// ----------------

// Thousands separator formatting, e.g. 1000 => 1,000
function formatNumber(string) {
    // toLocaleString does not handle well the formatting of numeric string with more than
    // 3 numbers after the decimal point
    if (string.includes(".")) {
        const [whole, decimal] = string.split(".");
        // console.log(`${typeof decimal}: ${decimal}`);
        return `${Number(whole).toLocaleString()}.${decimal}`;
    }
    return Number(string).toLocaleString();;
}

function unformatNumber(string) {
    return string.split(",").join("");
}

function getDisplayValue() {
    return unformatNumber(valueDiv.textContent);
}

function updateDisplayValue(value) {
    if (value === null) {
        valueDiv.textContent = "Cannot divide by zero";
    }
    else {
        valueDiv.textContent = formatNumber(value);
    }
}

function canAddCharacter() {
    return getDisplayValue().length < 15;
}

function checkBeforeInputting() {
    if (dividedByZero) {
        shouldClearExpression = true;
        enableButtons();
        dividedByZero = false;
    }
    if (shouldClearExpression) {
        expressionDiv.textContent = "";
        shouldClearExpression = false;
    }
    if (shouldResetDisplayValue) {
        updateDisplayValue("0");
        shouldResetDisplayValue = false;
    }
    // I put this after the above condition because the division by zero message
    // exceeds the 15 character limit and this won't allow inputting a digit without
    // resetting the display value first
    if (!canAddCharacter()) {
        return true;
    }
}

function handleDivisionByZero() {
    updateDisplayValue(null);
    firstNumber = "";
    operator = "";
    secondNumber = "";
    // Disable operator, equals, and backspace buttons
    operatorButtons.forEach(button => button.disabled = true);
    equalsButton.disabled = true;
    backspaceButton.disabled = true;
}

function enableButtons() {
    operatorButtons.forEach(button => button.disabled = false);
    equalsButton.disabled = false;
    backspaceButton.disabled = false;
}

function round(number) {
    return Math.round(number * 100) / 100;
}
// --------------
// Main functions
// --------------

function operate(operator, a, b) {
    a = Number(a);
    b = Number(b);
    let result;
    switch (operator) {
        case "+":
            return a + b;
        case "-":
            return a - b;
        case "×":
            return a * b;
        case "÷":
            if (b === 0) {
                dividedByZero = true;
                return null;
            }
            return a / b;
    }
}

function inputDigit(digit) {
    // If true, means the character limit is reached so can't add more digit
    if (checkBeforeInputting()) {
        return;
    }
    if (getDisplayValue() === "0") {
        updateDisplayValue(digit);
    }
    else {
        updateDisplayValue(getDisplayValue() + digit);
    }
    // console.log("inputDigit: ", digit);
}

function inputDecimalPoint() {
    if (checkBeforeInputting()) {
        return;
    }
    if (!getDisplayValue().includes(".")) {
        updateDisplayValue(getDisplayValue() + ".");
    }
}

function handleOperator(localOperator) {
    if (firstNumber && !shouldResetDisplayValue) {
        secondNumber = getDisplayValue();
        const result = operate(operator, firstNumber, secondNumber);
        if (result !== null) {
            firstNumber = String(round(result));
            // Clear secondNumber so that pressing an operator after a successful calculation won't run this conditional block
            secondNumber = "";
            updateDisplayValue(firstNumber);
        }
        else {
            handleDivisionByZero();
        }
    }
    else {
        firstNumber = getDisplayValue();
    }
    
    if (!dividedByZero) {
        expressionDiv.textContent = `${formatNumber(firstNumber)} ${localOperator}`;
    }
    operator = localOperator;
    // So that when using the result of equals() for another operation, pressing a digit
    // won't clear the expression 
    shouldClearExpression = false;
    // ---------------------------------------------------------------------------- 
    shouldResetDisplayValue = true;
    // console.log("handleOperator");
}

function equals() {
    if (firstNumber && !shouldResetDisplayValue) {
        secondNumber = getDisplayValue();
        expressionDiv.textContent = `${formatNumber(firstNumber)} ${operator} ${formatNumber(secondNumber)} =`;
        const result = operate(operator, firstNumber, secondNumber);
        if (result !== null) {
            firstNumber = "";
            operator = "";
            secondNumber = "";
            updateDisplayValue(String(round(result)));
        }
        else {
            handleDivisionByZero();
        }
    shouldClearExpression = true;
    shouldResetDisplayValue = true;
    }
    // console.log("calculate");
}

function backspace() {
    if (getDisplayValue().length === 1) {
        updateDisplayValue("0");
    }
    else {
        updateDisplayValue(getDisplayValue().slice(0, -1));
    }
}

function clear() {
    firstNumber = "";
    operator = "";
    secondNumber = "";
    shouldClearExpression = false;
    shouldResetDisplayValue = false;
    dividedByZero = false;
    expressionDiv.textContent = "";
    updateDisplayValue("0");
}


// ---------------
// Event listeners
// ---------------

digitButtons.forEach((button) => {
    button.addEventListener("click", () => inputDigit(button.textContent));
});

decimalPointButton.addEventListener("click", inputDecimalPoint);

operatorButtons.forEach((button) => {
    button.addEventListener("click", () => handleOperator(button.textContent));
});

equalsButton.addEventListener("click", equals);

clearButton.addEventListener("click", clear);

backspaceButton.addEventListener("click", backspace);

// This is for selecting the calculator button that corresponds to a key press
// so i can add my active class to it
const keyToButtonMap = {
    "Enter": document.querySelector(".equals")
};

// Populate keyToButtonMap
document.querySelectorAll("button").forEach((button) => {
    keyToButtonMap[button.dataset.key] = button;
});

// Keyboard support and adding the active class to the corresponding calculator button 
document.addEventListener("keydown", (e) => {
    if (e.key >= "0" && e.key <= "9") {
        inputDigit(e.key);
    }
    else if (e.key === ".") {
        inputDecimalPoint();
    }
    else if (e.key === "+" && !dividedByZero) {
        handleOperator("+");
    }
    else if (e.key === "-" && !dividedByZero) {
        handleOperator("-");
    }
    else if (e.key === "*" && !dividedByZero) {
        handleOperator("×");
    }
    else if (e.key === "/" && !dividedByZero) {
        e.preventDefault();
        handleOperator("÷");
    }
    else if ((e.key === "Enter" || e.key === "=") && !dividedByZero) {
        if (e.key === "Enter") {
            e.preventDefault();
        }
        equals();
    }
    else if (e.key === "Escape") {
        clear();
    }
    else if (e.key === "Backspace" && !dividedByZero) {
        backspace();
    }
    
    const button = keyToButtonMap[e.key];
    if (button) {
        if (e.key === "=" || e.key === "Enter") {
            button.classList.add("equals-button-active");
        }
        else {
            button.classList.add("button-active");
        }
    }
    // console.log(e.key);
});

// Remove active class of button on keyup
document.addEventListener("keyup", (e) => {
    const button = keyToButtonMap[e.key];
    if (button) {
        if (e.key === "=" || e.key === "Enter") {
            button.classList.remove("equals-button-active");
        }
        else {
            button.classList.remove("button-active");
        }
    }
    // console.log("keyup:", e.key);
});
