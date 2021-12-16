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

let renderFps = 60;
let renderStart = 0;
let renderFrameDuration = 1000/renderFps;

const simFps = 60;
let previous = 0; 
const simFrameDuration = 1000/simFps;
let lag = 0;

//hard coded players for now
const playerOne: Ball = {
  px: canvas.width/4, 
  py: canvas.height-10, 
  vx: 0,
  vy: 0,
  ax: 0,
  ay: 0,
  radius: 10,
  mass: 10,
  id: "player1"
}

const playerTwo: Ball = {
  px: canvas.width*3/4, 
  py: canvas.height-10, 
  vx: 0,
  vy: 0,
  ax: 0,
  ay: 0,
  radius: 10,
  mass: 10,
  id: "player2"
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
    //Update Positions
    

    //Static Collisions


    //Dynamic Collisions

    lag -= simFrameDuration;
  }
  
  //Rendering
  let lagOffset = lag / simFrameDuration;
  if (timestamp >= renderStart) {

    console.clear();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Draw Players
    for (let i = 0; i < players.length; i++) {
      ctx.beginPath();
      ctx.arc(players[i].px, players[i].py, players[i].radius, 0, Math.PI*2);
      console.log(players[i].px);
      ctx.fillStyle = "#0095DD";
      ctx.fill();
      ctx.closePath();
    }


    renderStart = timestamp + renderFrameDuration;
  }
  previous = timestamp;
}