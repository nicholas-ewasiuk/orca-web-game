const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 1200;
canvas.height = 900;
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
  if(e.key == "Down" || e.key == "ArrowDown") {
    downPressed = true;
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
  if(e.key == "Down" || e.key == "ArrowDown") {
    downPressed = false;
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
let downPressed = false;

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
const pMass = 30 //kg
const pSpd = 0.2; // m/s
const pRad = 50; // 1px = 1cm
const ballRad = 40;
const pA = Math.PI * pRad * pRad / (10000); // m^2
const ballA = Math.PI * 300 / (10000); // m^2

//hard coded players for now
const playerOne: Ball = {
  px: canvas.width/4, 
  py: ground-pRad, 
  vx: 0,
  vy: 0,
  ax: 0,
  ay: 0,
  radius: pRad,
  mass: pMass,
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
  mass: pMass,
  id: "player2"
}

const gameBall: Ball = {
  px: canvas.width/4, 
  py: canvas.height-400, 
  vx: 0,
  vy: 0,
  ax: 0,
  ay: 0,
  radius: ballRad,
  mass: 0.2,
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
    console.log(`vx: ${gameBall.vx} vy: ${gameBall.vy} ax: ${gameBall.ax} ay: ${gameBall.ay}`);
    //Update player positions. Right now crudely just for player1.
    if (players[0].py >= ground-players[0].radius) {
      if (upPressed) {
        players[0].vy -= 4;
      }
      if (downPressed) {
        //players[0].vy -= 2;
      }
    }
    if (rightPressed) {
      players[0].vx += pSpd;
    }
    if (leftPressed) {
      players[0].vx -= pSpd;
    }

    for (let i = 0; i < players.length; i++) {

      let FxPlayer = -0.5 * Cd * pA * rho * players[i].vx * players[i].vx * players[i].vx/Math.abs(players[i].vx);
      let FyPlayer = -0.5 * Cd * pA * rho * players[i].vy * players[i].vy * players[i].vy/Math.abs(players[i].vy);

      FxPlayer = (isNaN(FxPlayer) ? 0 : FxPlayer);
      FyPlayer = (isNaN(FyPlayer) ? 0 : FyPlayer);

      players[i].ax = FxPlayer / players[i].mass;
      players[i].ay = 5 + (FyPlayer / players[i].mass);

      players[i].vx += players[i].ax/simFps;
      players[i].vy += players[i].ay/simFps;

      players[i].px += players[i].vx/simFps*100;
      players[i].py += players[i].vy/simFps*100;
    }

    //Update ball position
    let FxBall = -0.5 * Cd * ballA * rho * gameBall.vx * gameBall.vx * gameBall.vx/Math.abs(gameBall.vx);
    let FyBall = -0.5 * Cd * ballA * rho * gameBall.vy * gameBall.vy * gameBall.vy/Math.abs(gameBall.vy);

    FxBall = (isNaN(FxBall) ? 0 : FxBall);
    FyBall = (isNaN(FyBall) ? 0 : FyBall);

    gameBall.ax = FxBall / gameBall.mass;
    gameBall.ay = ag + (FyBall / gameBall.mass);

    gameBall.vx += gameBall.ax/simFps;
    gameBall.vy += gameBall.ay/simFps;

    gameBall.px += gameBall.vx/simFps*100;
    gameBall.py += gameBall.vy/simFps*100;

    //Collisions
    for (let i = 0; i < players.length; i++) {
      let deltaPx = players[i].px - gameBall.px;
      let deltaPy = players[i].py - gameBall.py;
      let deltaPsq = deltaPx * deltaPx + deltaPy * deltaPy;
      let minPsq = (gameBall.radius + players[i].radius) * (gameBall.radius + players[i].radius);

      if (players[i].py > ground-players[i].radius) {
        players[i].py = ground-players[i].radius;
        players[i].vy = 0;
      }
      if (deltaPsq < minPsq) {
        let distance = Math.sqrt(deltaPsq);
        let overlap = 0.5 * (distance - gameBall.radius - players[i].radius);

        gameBall.px -= overlap * (gameBall.px - players[i].px) / distance;
        gameBall.py -= overlap * (gameBall.py - players[i].py) / distance;

        let nx = deltaPx / distance;
        let ny = deltaPy / distance;

        let tx = -ny;
        let ty = nx;

        let dpTan1 = gameBall.vx * tx + gameBall.vy * ty;
        //let dpTan2 = players[i].vx * tx + players[i].vy * ty;

        let dpNorm1 = gameBall.vx * nx + gameBall.vy * ny;
        let dpNorm2 = players[i].vx * nx + players[i].vy * ny;

        let m1 = (dpNorm1 * (gameBall.mass - players[i].mass) + 2.0 * players[i].mass * dpNorm2) / (gameBall.mass + players[i].mass);
        //let m2 = (dpNorm1 * (players[i].mass - gameBall.mass) + 2.0 * gameBall.mass * dpNorm1) / (gameBall.mass + players[i].mass);

        gameBall.vx = tx * dpTan1 + nx * m1;
        gameBall.vy = ty * dpTan1 + ny * m1 * 1.5;
        //players[i].vx = tx * dpTan2 + nx * m2;
        //players[i].vy = ty * dpTan2 + ny * m2;
      }
    }
    
    if (gameBall.py > ground-gameBall.radius) {
      gameBall.py = canvas.height-400;
      gameBall.px = canvas.width/4;
      gameBall.vy = 0;
      gameBall.vx = 0;
    }

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