const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 900;
canvas.height = 600;
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
  radius: number; //1px = 1cm
  mass: number; //kg
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
const Cd = 0.47; // Unitless
const rho = 1.22; // kg/m^3
const ag = 9.8; // m/s^2
const pSpd = 0.2; // m/s
const pRad = 30; // 1px = 1cm
const A = Math.PI * pRad * pRad / (10000); // m^2

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
        //players[0].vy -= 2;
        gameBall.vy -= pSpd;
      }
    }
    if (rightPressed) {
      //players[0].vx += pSpd;
      gameBall.vx += pSpd;
    }
    if (leftPressed) {
      //players[0].vx -= pSpd;
      gameBall.vx -= pSpd;
    }

    for (let i = 0; i < players.length; i++) {

      players[i].vx += players[i].ax/simFps;
      players[i].px += players[i].vx/simFps*100;

      players[i].vy += ag/simFps;
      players[i].vy += players[i].ay/simFps;
      players[i].py += players[i].vy/simFps*100;
    }

    //Update ball position
    let FxBall = -0.5 * Cd * A * rho * gameBall.vx * gameBall.vx * gameBall.vx/Math.abs(gameBall.vx);
    let FyBall = -0.5 * Cd * A * rho * gameBall.vy * gameBall.vy * gameBall.vy/Math.abs(gameBall.vy);

    FxBall = (isNaN(FxBall) ? 0 : FxBall);
    FyBall = (isNaN(FyBall) ? 0 : FyBall);

    gameBall.ax = FxBall / gameBall.mass;
    gameBall.ay = ag + (FyBall / gameBall.mass);

    gameBall.vx += gameBall.ax/simFps;
    gameBall.vy += gameBall.ay/simFps;

    gameBall.px += gameBall.vx/simFps*100;
    gameBall.py += gameBall.vy/simFps*100;

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