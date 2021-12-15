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
function oBall(px, py, vx, vy, ax, ay, radius, mass, id) {
  this.px = px;
  this.py = py;
  this.vx = vx;
  this.vy = vy;
  this.ax = ax;
  this.ay = ay;
  this.radius = radius;
  this.mass = mass;
  this.id = id;
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

const players = [];



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
    //update();
    lag -= simFrameDuration;
  }
  
  //Rendering
  let lagOffset = lag / simFrameDuration;
  if (timestamp >= renderStart) {
    //renderWithInterpolation(lagOffset);
    renderStart = timestamp + renderFrameDuration;
  }
  previous = timestamp;
}