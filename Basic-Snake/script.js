const gameBoard = document.getElementById("game-board");


// Game configuration
const GRID_SIZE = 20; // 20x20 grid
let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 }; // Movement direction
let food = { x: 5, y: 5 }; // Initial food position
let gameInterval;
let speed = 150; // Speed of the game in ms


// Initialize the game
function startGame() {
    gameInterval = setInterval(gameLoop, speed);
    placeFood();
    draw();
}


// Game loop
function gameLoop() {
    moveSnake();
    if (checkCollision()) {
        alert("Game Over!");
        clearInterval(gameInterval);
        return;
    }
    checkFood();
    draw();
}


// Move the snake
function moveSnake() {
    const head = { ...snake[0] };
    head.x += direction.x;
    head.y += direction.y;


    // Add new head to the snake
    snake.unshift(head);


    // Remove the last segment unless eating food
    if (head.x !== food.x || head.y !== food.y) {
        snake.pop();
    }
}


// Check for collisions with walls or itself
function checkCollision() {
    const head = snake[0];
    return (
        head.x < 0 || head.x >= GRID_SIZE || // Wall collision (x-axis)
        head.y < 0 || head.y >= GRID_SIZE || // Wall collision (y-axis)
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y) // Self collision
    );
}


// Check if snake eats the food
function checkFood() {
    const head = snake[0];
    if (head.x === food.x && head.y === food.y) {
        placeFood();
    }
}


// Place the food in a random location
function placeFood() {
    food = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
    };
}


// Draw the snake and food on the grid
function draw() {
    gameBoard.innerHTML = ""; // Clear the board


    // Draw snake
    snake.forEach(segment => {
        const snakeElement = document.createElement("div");
        snakeElement.style.gridRowStart = segment.y + 1;
        snakeElement.style.gridColumnStart = segment.x + 1;
        snakeElement.classList.add("snake");
        gameBoard.appendChild(snakeElement);
    });


    // Draw food
    const foodElement = document.createElement("div");
    foodElement.style.gridRowStart = food.y + 1;
    foodElement.style.gridColumnStart = food.x + 1;
    foodElement.classList.add("food");
    gameBoard.appendChild(foodElement);
}


// Handle key inputs for direction
window.addEventListener("keydown", e => {
    switch (e.key) {
        case "ArrowUp":
            if (direction.y !== 1) direction = { x: 0, y: -1 };
            break;
        case "ArrowDown":
            if (direction.y !== -1) direction = { x: 0, y: 1 };
            break;
        case "ArrowLeft":
            if (direction.x !== 1) direction = { x: -1, y: 0 };
            break;
        case "ArrowRight":
            if (direction.x !== -1) direction = { x: 1, y: 0 };
            break;
    }
});


// Start the game
startGame();