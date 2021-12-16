const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 300;
canvas.id = "game-window";
document.body.appendChild(canvas);

//Select FPS to suit display
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

//Keyboard Input
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
  e.preventDefault();
  if(e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  }
  if(e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
  if(e.key == "Up" || e.key == "ArrowUp") {
    upPressed = true;
  }
}

function keyUpHandler(e) {
  e.preventDefault();
  if(e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  }
  if(e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
  if(e.key == "Up" || e.key == "ArrowUp") {
    upPressed = false;
  }
}

//Ball Object Constructor
type Ball = {
  px: number; 
  py: number; 
  vx: number;
  vy: number;
  ax: number;
  ay: number;
  radius: number;
  mass: number;
  id: string;
}

let leftPressed = false;
let rightPressed = false;
let upPressed = false;

let renderFps = 60;
let renderStart = 0;
let renderFrameDuration = 1000/renderFps;

const simFps = 60;
let previous = 0; 
const simFrameDuration = 1000/simFps;
let lag = 0;

const ground = canvas.height;
const gravity = 40/1000;
const pSpd = 0.2;
const pRad = 30;

//hard coded players for now
const playerOne: Ball = {
  px: canvas.width/4, 
  py: ground-pRad, 
  vx: 0,
  vy: 0,
  ax: 0,
  ay: 0,
  radius: pRad,
  mass: 10,
  id: "player1"
}

const playerTwo: Ball = {
  px: canvas.width*3/4, 
  py: ground-pRad, 
  vx: 0,
  vy: 0,
  ax: 0,
  ay: 0,
  radius: pRad,
  mass: 10,
  id: "player2"
}

const gameBall: Ball = {
  px: canvas.width/4, 
  py: canvas.height-200, 
  vx: 0,
  vy: 0,
  ax: 0,
  ay: 0,
  radius: 10,
  mass: 1,
  id: "ball"
}

const players = [playerOne, playerTwo];
console.log(players);


//Game Loop
draw(null);

function draw(timestamp) {
  requestAnimationFrame(draw);

  if (!timestamp) {
    timestamp = 0;
  }
  let elapsed = timestamp - previous;
  if (elapsed > 1000) {
    elapsed = simFrameDuration;
  }
  lag += elapsed;

  //Logic
  while (lag >= simFrameDuration) {
    console.clear()
    //Update player positions. Right now crudely just for player1.
    if (players[0].py >= ground-players[0].radius) {
      if (upPressed) {
        players[0].vy -= 2;
      }
    }
    if (rightPressed) {
      players[0].vx += pSpd;
    }
    if (leftPressed) {
      players[0].vx -= pSpd;
    }

    for (let i = 0; i < players.length; i++) {

      players[i].vx += players[i].ax;
      players[i].px += players[i].vx;

      players[i].vy += gravity;
      players[i].vy += players[i].ay;
      players[i].py += players[i].vy;
    }

    //Update ball position
    gameBall.vx += gameBall.ax;
    gameBall.px += gameBall.vx;

    gameBall.vy += gravity;
    gameBall.vy += gameBall.ay;
    gameBall.py += gameBall.vy;

    //Static Collisions
    for (let i = 0; i < players.length; i++) {
      if (players[i].py > ground-players[i].radius) {
        players[i].py = ground-players[i].radius;
        players[i].vy = 0;
      }
    }
    
    if (gameBall.py > ground-gameBall.radius) {
      gameBall.py = ground-gameBall.radius;
      gameBall.vy = 0;
    }

    //Dynamic Collisions

    lag -= simFrameDuration;
  }
  
  //Rendering
  let lagOffset = lag / simFrameDuration;
  if (timestamp >= renderStart) {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Draw Players
    for (let i = 0; i < players.length; i++) {
      ctx.beginPath();
      ctx.arc(players[i].px, players[i].py, players[i].radius, 0, Math.PI*2);
      ctx.fillStyle = "#0095DD";
      ctx.fill();
      ctx.closePath();
    }

    //Draw Game Ball
    ctx.beginPath();
    ctx.arc(gameBall.px, gameBall.py, gameBall.radius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();

    renderStart = timestamp + renderFrameDuration;
  }
  previous = timestamp;
}