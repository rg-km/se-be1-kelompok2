const CELL_SIZE = 20;
const CANVAS_SIZE = 600;
const INITIAL_REDRAW_INTERVAL = 50;
const INITIAL_MOVE_INTERVAL = 120;
const WIDTH = CANVAS_SIZE / CELL_SIZE;
const HEIGHT = CANVAS_SIZE / CELL_SIZE;
const DIRECTION = {
  LEFT: 0,
  RIGHT: 1,
  UP: 2,
  DOWN: 3,
};

let redrawInterval = INITIAL_REDRAW_INTERVAL;
let moveInterval = INITIAL_MOVE_INTERVAL;
let playerLives = 3;
let level = 1;

function initPosition() {
  return {
    x: Math.floor(Math.random() * WIDTH),
    y: Math.floor(Math.random() * HEIGHT),
  };
}

function initHeadAndBody() {
  let head = initPosition();
  let body = [{ x: head.x, y: head.y }];
  return {
    head,
    body,
  };
}

function initDirection() {
  return Math.floor(Math.random() * 4);
}

function initSnake(color, score) {
  return {
    color: color,
    ...initHeadAndBody(),
    direction: initDirection(),
    score: score || 0,
  };
}

let snake = initSnake("purple");
let apples = [
  {
    position: initPosition(),
  },
  {
    position: initPosition(),
  },
];
let liveFoodPosition = initPosition();
let lives = [
  {
    position: {
      x: 10,
      y: 10,
    },
  },
  {
    position: {
      x: 30,
      y: 10,
    },
  },
  {
    position: {
      x: 50,
      y: 10,
    },
  },
];
let obstaclePerLevel = [
  [],
  [
    {
      start: {
        x: 5,
        y: 10,
      },
      end: {
        x: 24,
        y: 10,
      },
    },
  ],
  [
    {
      start: {
        x: 6,
        y: 8,
      },
      end: {
        x: 6,
        y: 21,
      },
    },
    {
      start: {
        x: 23,
        y: 8,
      },
      end: {
        x: 23,
        y: 21,
      },
    },
  ],
  [
    {
      start: {
        x: 6,
        y: 8,
      },
      end: {
        x: 6,
        y: 21,
      },
    },
    {
      start: {
        x: 23,
        y: 8,
      },
      end: {
        x: 23,
        y: 21,
      },
    },
    {
      start: {
        x: 11,
        y: 14,
      },
      end: {
        x: 18,
        y: 14,
      },
    },
  ],
  [
    {
      start: {
        x: 6,
        y: 8,
      },
      end: {
        x: 6,
        y: 21,
      },
    },
    {
      start: {
        x: 23,
        y: 8,
      },
      end: {
        x: 23,
        y: 21,
      },
    },
    {
      start: {
        x: 8,
        y: 6,
      },
      end: {
        x: 21,
        y: 6,
      },
    },
    {
      start: {
        x: 8,
        y: 23,
      },
      end: {
        x: 21,
        y: 23,
      },
    },
  ],
];

function drawCell(ctx, x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawScore(snake) {
  let scoreCanvas;
  scoreCanvas = document.getElementById("score1Board");
  let scoreCtx = scoreCanvas.getContext("2d");
  scoreCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  scoreCtx.font = "30px Arial";
  scoreCtx.fillStyle = snake.color;
  scoreCtx.fillText(snake.score, 10, scoreCanvas.scrollHeight / 2);
}

function drawLevel() {
  let levelCanvas = document.getElementById("levelBoard");
  let ctx = levelCanvas.getContext("2d");
  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  ctx.font = "30px Arial";
  ctx.fillStyle = "black";
  ctx.fillText(level, 10, levelCanvas.scrollHeight / 2);
}

function drawLives() {
  let livesCanvas = document.getElementById("livesBoard");
  let ctx = livesCanvas.getContext("2d");
  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  for (var i = 0; i < playerLives; i++) {
    let live = lives[i];
    var img = document.getElementById("heart");
    if (!live)
      lives.push({
        position: {
          x: lives[i - 1].position.x + 20,
          y: 10,
        },
      });
    ctx.drawImage(img, live.position.x, live.position.y, CELL_SIZE, CELL_SIZE);
  }
}

function isPrime(num) {
  for (let i = 2, s = Math.sqrt(num); i <= s; i++)
    if (num % i === 0) return false;
  return num > 1;
}

function drawObstacle(ctx) {
  let obstacle = obstaclePerLevel[level - 1];
  for (let i = 0; i < obstacle.length; i++) {
    for (let j = obstacle[i].start.x; j <= obstacle[i].end.x; j++) {
      for (let k = obstacle[i].start.y; k <= obstacle[i].end.y; k++) {
        drawCell(ctx, j, k, "black");
      }
    }
  }
}

function draw() {
  setInterval(function () {
    let snakeCanvas = document.getElementById("snakeBoard");
    let ctx = snakeCanvas.getContext("2d");

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    drawCell(ctx, snake.head.x, snake.head.y, snake.color);
    for (let i = 1; i < snake.body.length; i++) {
      drawCell(ctx, snake.body[i].x, snake.body[i].y, snake.color);
    }
    for (let i = 0; i < apples.length; i++) {
      let apple = apples[i];
      var img = document.getElementById("apple");
      ctx.drawImage(
        img,
        apple.position.x * CELL_SIZE,
        apple.position.y * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE
      );
    }
    if (isPrime(snake.score)) {
      var img = document.getElementById("heart");
      ctx.drawImage(
        img,
        liveFoodPosition.x * CELL_SIZE,
        liveFoodPosition.y * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE
      );
    }
    drawObstacle(ctx);
    drawScore(snake);
    drawLevel();
    drawLives();
  }, redrawInterval);
}

function teleport(snake) {
  if (snake.head.x < 0) {
    snake.head.x = CANVAS_SIZE / CELL_SIZE - 1;
  }
  if (snake.head.x >= WIDTH) {
    snake.head.x = 0;
  }
  if (snake.head.y < 0) {
    snake.head.y = CANVAS_SIZE / CELL_SIZE - 1;
  }
  if (snake.head.y >= HEIGHT) {
    snake.head.y = 0;
  }
}

function increaseLevel() {
  if (snake.score === 30) {
    let audio = new Audio("win.wav");
    audio.play();
    alert("You won!");
    playerLives = 3;
    snake = initSnake("purple");
    return;
  }
  let audio = new Audio("level-up.wav");
  audio.play();
  moveInterval -= 20;
  snake.score++;
  level++;
}

function eat(snake, apples) {
  for (let i = 0; i < apples.length; i++) {
    let apple = apples[i];
    if (snake.head.x == apple.position.x && snake.head.y == apple.position.y) {
      apple.position = initPosition();
      snake.score++;
      snake.body.push({ x: snake.head.x, y: snake.head.y });
    }
  }

  if (
    snake.head.x === liveFoodPosition.x &&
    snake.head.y === liveFoodPosition.y &&
    isPrime(snake.score)
  ) {
    var audio = new Audio("add-live.wav");
    audio.play();
    playerLives++;
    snake.score += 2;
    liveFoodPosition = initPosition();
  }

  if (snake.score % 5 === 0 && snake.score > 0) increaseLevel();
}

function moveLeft(snake) {
  snake.head.x--;
  teleport(snake);
  eat(snake, apples);
}

function moveRight(snake) {
  snake.head.x++;
  teleport(snake);
  eat(snake, apples);
}

function moveDown(snake) {
  snake.head.y++;
  teleport(snake);
  eat(snake, apples);
}

function moveUp(snake) {
  snake.head.y--;
  teleport(snake);
  eat(snake, apples);
}

function checkCollision(snakes) {
  let isCollide = false;
  for (let i = 1; i < snakes.body.length; i++) {
    if (
      snakes.head.x == snakes.body[i].x &&
      snakes.head.y == snakes.body[i].y
    ) {
      isCollide = true;
    }
  }
  let obstacle = obstaclePerLevel[level - 1];
  for (let i = 0; i < obstacle.length; i++) {
    for (let j = obstacle[i].start.x; j <= obstacle[i].end.x; j++) {
      for (let k = obstacle[i].start.y; k <= obstacle[i].end.y; k++) {
        if (snakes.head.x == j && snakes.head.y == k) {
          isCollide = true;
        }
      }
    }
  }
  if (isCollide) {
    playerLives--;
    if (playerLives == 0) {
      var audio = new Audio("game-over.wav");
      audio.play();
      alert("Game over");
      playerLives = 3;
      snake = initSnake("purple");
    } else snake = initSnake("purple", snake.score);
  }
  return isCollide;
}

function move(snake) {
  switch (snake.direction) {
    case DIRECTION.LEFT:
      moveLeft(snake);
      break;
    case DIRECTION.RIGHT:
      moveRight(snake);
      break;
    case DIRECTION.DOWN:
      moveDown(snake);
      break;
    case DIRECTION.UP:
      moveUp(snake);
      break;
  }
  moveBody(snake);
  if (!checkCollision(snake)) {
    setTimeout(function () {
      move(snake);
    }, moveInterval);
  } else {
    initGame();
  }
}

function moveBody(snake) {
  snake.body.unshift({ x: snake.head.x, y: snake.head.y });
  snake.body.pop();
}

function turn(snake, direction) {
  const oppositeDirections = {
    [DIRECTION.LEFT]: DIRECTION.RIGHT,
    [DIRECTION.RIGHT]: DIRECTION.LEFT,
    [DIRECTION.DOWN]: DIRECTION.UP,
    [DIRECTION.UP]: DIRECTION.DOWN,
  };

  if (direction !== oppositeDirections[snake.direction]) {
    snake.direction = direction;
  }
}

document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowLeft") {
    turn(snake, DIRECTION.LEFT);
  } else if (event.key === "ArrowRight") {
    turn(snake, DIRECTION.RIGHT);
  } else if (event.key === "ArrowUp") {
    turn(snake, DIRECTION.UP);
  } else if (event.key === "ArrowDown") {
    turn(snake, DIRECTION.DOWN);
  }
});

function initGame() {
  move(snake);
}

initGame();
