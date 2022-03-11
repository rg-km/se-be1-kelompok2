const CELL_SIZE = 20;
const CANVAS_SIZE = 600;
const REDRAW_INTERVAL = 50;
const WIDTH = CANVAS_SIZE / CELL_SIZE;
const HEIGHT = CANVAS_SIZE / CELL_SIZE;
const DIRECTION = {
  LEFT: 0,
  RIGHT: 1,
  UP: 2,
  DOWN: 3,
};

const MOVE_INTERVAL = 120;

let playerLives = 3;

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
    color: "red",
    position: initPosition(),
  },
  {
    color: "green",
    position: initPosition(),
  },
];
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

function drawLives() {
  let livesCanvas = document.getElementById("livesBoard");
  let ctx = livesCanvas.getContext("2d");
  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  for (var i = 0; i < playerLives; i++) {
    let live = lives[i];
    var img = document.getElementById("heart");
    ctx.drawImage(img, live.position.x, live.position.y, CELL_SIZE, CELL_SIZE);
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
    drawScore(snake);
    drawLives();
  }, REDRAW_INTERVAL);
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

function eat(snake, apples) {
  for (let i = 0; i < apples.length; i++) {
    let apple = apples[i];
    if (snake.head.x == apple.position.x && snake.head.y == apple.position.y) {
      apple.position = initPosition();
      snake.score++;
      snake.body.push({ x: snake.head.x, y: snake.head.y });
    }
  }
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
  if (isCollide) {
    playerLives--;
    if (playerLives == 0) {
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
    }, MOVE_INTERVAL);
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
