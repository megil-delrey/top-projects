let isLeftClickHeld = false;
document.body.addEventListener("mousedown", () => isLeftClickHeld = true);
document.body.addEventListener("mouseup", () => isLeftClickHeld = false);

const changeGridSizeBtn = document.querySelector("#btn1");
const resetGridBtn = document.querySelector("#btn2");
const grid = document.querySelector('#grid');

function generateRandomColor() {
    let hexNumbers = "01234567890abcdef";
    let result = "#";
    for (let i = 0; i < 6; i++) {
        result += hexNumbers[Math.floor(Math.random() * 16)];
    }
    return result;
}

function colorSquare(element) {
    element.style.backgroundColor = generateRandomColor();
    element.style.opacity -= 0.1;
}

function createGrid(n) {
    for(let i = 0; i < n*n; i++) {
        const square = document.createElement('div');
        square.style.backgroundColor = 'white';
        square.style.outline = '1px solid lightgray';
        square.style.opacity = 1;
        square.style.flexBasis = `calc(100% / ${n})`;
        square.addEventListener('dragstart', (e) => e.preventDefault());
        square.addEventListener('mousedown', () => {
            colorSquare(square);
        });
        square.addEventListener('mouseenter', () => {
            if (isLeftClickHeld) colorSquare(square);
        });
        grid.appendChild(square);
    }
}

changeGridSizeBtn.addEventListener('click', () => {
    let n = parseInt(prompt('Enter number of squares per side.'));
    if (n > 100) {
        alert('Number of squares per side must not exceed 100.');
    } else {
        grid.replaceChildren();
        createGrid(n);    
    }
});

resetGridBtn.addEventListener("click", () => {
    grid.replaceChildren();
    createGrid(50);
});

createGrid(50);
alert('Hold down left mouse button to draw.');



