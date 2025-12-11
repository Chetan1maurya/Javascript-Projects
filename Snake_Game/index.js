const board = document.querySelector(".board");
const startButton = document.querySelector(".btn-start");
const modal = document.querySelector(".modal");
const startGameModal = document.querySelector(".start-game");
const gameOverModal = document.querySelector(".game-over");

const blockHeight = 30;
const blockWidth = 30;

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);
let SnakeInterval = null;
let food = {
  x: Math.floor(Math.random() * rows),
  y: Math.floor(Math.random() * cols),
};

const blocks = [];
//initial length 3
const snake = [
  { x: 1, y: 3 },
  { x: 1, y: 4 },
  { x: 1, y: 5 },
];
let direction = "down";

for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const block = document.createElement("div");
    block.classList.add("block");
    board.appendChild(block);
    blocks[`${row} - ${col}`] = block;
  }
}

function render() {
  let head = null;

  blocks[`${food.x} - ${food.y}`].classList.add("food");

  if (direction === "left") {
    head = { x: snake[0].x, y: snake[0].y - 1 };
  } else if (direction === "right") {
    head = { x: snake[0].x, y: snake[0].y + 1 };
  } else if (direction === "up") {
    head = { x: snake[0].x - 1, y: snake[0].y };
  } else if (direction === "down") {
    head = { x: snake[0].x + 1, y: snake[0].y };
  }
  if (head.x < 0 || head.y < 0 || head.x >= rows || head.y >= cols) {
    clearInterval(SnakeInterval);
    snake.forEach((segment) => {
      blocks[`${segment.x} - ${segment.y}`].classList.remove("fill");
      blocks[`${segment.x} - ${segment.y}`].classList.add("dead");
    });
    modal.style.display = "flex";
    startGameModal.style.display = "none";
    gameOverModal.style.display = "flex";
    return;
  }
  if(head.x == food.x && head.y == food.y){
    blocks[`${food.x} - ${food.y}`].classList.remove("food");
    const tail = snake[snake.length - 1]
    snake.push({x: tail.x, y: tail.y})
    food = {
        x: Math.floor(Math.random() * rows),
        y: Math.floor(Math.random() * cols),
    }
    blocks[`${food.x} - ${food.y}`].classList.add("food");
  }
  snake.forEach((segment) => {
    blocks[`${segment.x} - ${segment.y}`].classList.remove("fill");
  });
  //unshift add at start of array snake
  snake.unshift(head);
  snake.pop();
  snake.forEach((segment) => {
    blocks[`${segment.x} - ${segment.y}`].classList.add("fill");
  });
}

startButton.addEventListener("click",() => {
    modal.style.display = "none"
    SnakeInterval = setInterval(() => {
      render();
    }, 400);
})

function restartGame(){
     
}

addEventListener("keydown", (event) => {
  if (event.key == "ArrowUp") {
    direction = "up";
  } else if (event.key == "ArrowRight") {
    direction = "right";
  } else if (event.key == "ArrowLeft") {
    direction = "left";
  } else if (event.key == "ArrowDown") {
    direction = "down";
  }
});
