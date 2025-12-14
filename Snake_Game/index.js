const board = document.querySelector(".board");
const startButton = document.querySelector(".btn-start");
const modal = document.querySelector(".modal");
const startGameModal = document.querySelector(".start-game");
const gameOverModal = document.querySelector(".game-over");
const restartButton = document.querySelector(".btn-restart");

const highScoreElement = document.querySelector("#high-score");
const scoreElement = document.querySelector("#score");
const timeElement = document.querySelector("#time");

const blockHeight = 50;
const blockWidth = 50;

let highScore = localStorage.getItem("highScore") || 0;
let score = 0;
let time = '00-00';
highScoreElement.innerText = highScore;

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

let SnakeInterval = null;
let timerIntervalId = null;

let food = {
  x: Math.floor(Math.random() * rows),
  y: Math.floor(Math.random() * cols),
};

const blocks = [];
//initial length 3
let snake = [
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

function gameover() {
    clearInterval(SnakeInterval);
    clearInterval(timerIntervalId);

    snake.forEach((segment) => {
      blocks[`${segment.x} - ${segment.y}`].classList.remove("fill");
      blocks[`${segment.x} - ${segment.y}`].classList.add("dead");
    });

    modal.style.display = "flex";
    startGameModal.style.display = "none";
    gameOverModal.style.display = "flex";
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

  //dead logic
  if (head.x < 0 || head.y < 0 || head.x >= rows || head.y >= cols) {
    gameover();
    return;
  }
  for(let i=0;i<snake.length;i++){
    if(head.x == snake[i].x && head.y == snake[i].y){
      gameover();
      return;
    }
  }

  //food consuming logic
  if(head.x == food.x && head.y == food.y){
    blocks[`${food.x} - ${food.y}`].classList.remove("food");
    const tail = snake[snake.length - 1];
    snake.push({x: tail.x, y: tail.y})
    food = {
        x: Math.floor(Math.random() * rows),
        y: Math.floor(Math.random() * cols),
    }
    blocks[`${food.x} - ${food.y}`].classList.add("food");
    score += 10;
    scoreElement.innerText = score;

    if(score > highScore){
      highScore = score;
      localStorage.setItem("highScore", highScore.toString())
      highScoreElement.innerText = highScore;
    }
  }

  //movement logic
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
      console.log("from start button")
      render();
    }, 200);
    timerIntervalId = setInterval(() => {
      let [min, sec] = time.split('-').map(Number);

      if(sec == 59){
        min += 1;
        sec = 0;
      }
      else{
        sec += 1;
      }

      time = `${min}-${sec}`;
      timeElement.innerText = time;
    },1000)
})
restartButton.addEventListener("click", restartGame);
function restartGame(){
    snake.forEach((segment) => {
        blocks[`${segment.x} - ${segment.y}`].classList.remove("dead");
    });
    blocks[`${food.x} - ${food.y}`].classList.remove("food");
    modal.style.display = "none";
    snake = [
      { x: 1, y: 3 },
      { x: 1, y: 4 },  
      { x: 1, y: 5 },
    ];
    score = 0;
    time = '00-00';
    direction = "down";
    scoreElement.innerText = score;
    timeElement.innerText = time;
    highScoreElement.innerText = highScore;
    food = {x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols)}
    SnakeInterval = setInterval(() => {
      console.log("from restart Game")
      render();
    }, 200);
    timerIntervalId = setInterval(() => {
      let [min, sec] = time.split('-').map(Number);

      if(sec == 59){
        min += 1;
        sec = 0;
      }
      else{
        sec += 1;
      }

      time = `${min}-${sec}`;
      timeElement.innerText = time;
    },1000)
    render();
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
