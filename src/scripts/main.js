/*
const canvas = document.getElementById("game-window");

const ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 300;

const ballRadius = 10;
const ballSpd = 2;
const paddleSpd = 5;

let x = canvas.width/2;
let y = canvas.height-30;
let dx = ballSpd;
let dy = -ballSpd;
let lives = 3;
let score = 0;

let renderFps = 60;
let renderStart = 0;
let renderFrameDuration = 1000/renderFps;

let fps = 60;
let previous = 0; 
let frameDuration = 1000/fps;
let lag = 0;

const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width-paddleWidth) / 2;

const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
const bricks = [];
for (let i = 0; i < brickColumnCount; i++) {
  bricks[i] = [];
  for (let j = 0; j < brickRowCount; j++) {
    bricks[i][j] = { x: 0, y: 0, status: 1 };
  }
}

let rightPressed = false;
let leftPressed = false;

//window.addEventListener("resize", setCanvasSize);
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.getElementById("fps-select").addEventListener("click", onSelectFPS);

function onSelectFPS(event) {
  const target = event.target;
  switch (target.value) {
    case "60":
      renderFps = target.value;
      renderFrameDuration = 1000/renderFps;
      break;
    case "90":
      renderFps = target.value;
      renderFrameDuration = 1000/renderFps;
      break;
    case "120":
      renderFps = target.value;
      renderFrameDuration = 1000/renderFps;
      break;
    default:
  }
}

function setCanvasSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function keyDownHandler(e) {
  e.preventDefault();
  if(e.key == "Right" || e.key == "ArrowRight") {
      rightPressed = true;
  }
  else if(e.key == "Left" || e.key == "ArrowLeft") {
      leftPressed = true;
  }
}

function keyUpHandler(e) {
  e.preventDefault();
  if(e.key == "Right" || e.key == "ArrowRight") {
      rightPressed = false;
  }
  else if(e.key == "Left" || e.key == "ArrowLeft") {
      leftPressed = false;
  }
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: "+score, 8, 20);
}

function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

function drawBall(lagOffset) {
  let lerpX = x + (dx * lagOffset);
  let lerpY = y + (dy * lagOffset);
  ctx.beginPath();
  ctx.arc(lerpX, lerpY, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle(lagOffset) {
  let lerpX = paddleX;
  if (rightPressed) {
    lerpX = paddleX + (paddleSpd*lagOffset);
  } else if (leftPressed) {
    lerpX = paddleX - (paddleSpd*lagOffset);
  }
  ctx.beginPath();
  ctx.rect(lerpX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (let i = 0; i < brickColumnCount; i++) {
    for (let j = 0; j < brickRowCount; j++) {
      if (bricks[i][j].status == 1) {
        var brickX = (i*(brickWidth+brickPadding))+brickOffsetLeft;
        var brickY = (j*(brickHeight+brickPadding))+brickOffsetTop;
        bricks[i][j].x = brickX;
        bricks[i][j].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

draw();

function draw(timestamp) {
  requestAnimationFrame(draw);

  if (!timestamp) {
    timestamp = 0;
  }
  let elapsed = timestamp - previous;
  if (elapsed > 1000) {
    elapsed = frameDuration;
  }
  lag += elapsed;

  while (lag >= frameDuration) {
    for (let i = 0; i < brickColumnCount; i++) {
      for (let j = 0; j < brickRowCount; j++) {
        let b = bricks[i][j];
        if (b.status == 1) {
          if (x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
            dy = -dy;
            b.status = 0;
            score++;
            if (score == brickRowCount*brickColumnCount) {
              alert("YOU WIN, CONGRATULATIONS!");
              document.location.reload();
            }
          }
        }
      }
    }
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
      dx = -dx;
    }
    if (y + dy < ballRadius) {
      dy = -dy;
    } else if (y + dy > canvas.height-ballRadius) {
      if (x > paddleX && x < paddleX + paddleWidth) {
        dy = -dy;
      } else {
        lives--;
        if(!lives) {
          alert("GAME OVER");
          document.location.reload();
        } else {
          x = canvas.width/2;
          y = canvas.height-30;
          dx = ballSpd;
          dy = -ballSpd;
          paddleX = (canvas.width-paddleWidth)/2;
        }
      }
    }
    x += dx;
    y += dy;
    if(rightPressed) {
      paddleX += paddleSpd;
      if (paddleX + paddleWidth > canvas.width){
          paddleX = canvas.width - paddleWidth;
      }
    }
    else if(leftPressed) {
      paddleX -= paddleSpd;
      if (paddleX < 0){
          paddleX = 0;
      }
    }
    lag -= frameDuration;
  }

  let lagOffset = lag / frameDuration;
  if (timestamp >= renderStart) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall(lagOffset);
    drawBricks();
    drawPaddle(lagOffset);
    drawScore();
    drawLives();
    renderStart = timestamp + renderFrameDuration;
  }
  previous = timestamp;
}
*/