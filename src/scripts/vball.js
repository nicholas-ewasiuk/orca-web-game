const canvas = document.getElementById("game-window");
const ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 300;

//Player can change render FPS to suit display
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

//Keyboard inputs
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

let leftPressed = false;
let rightPressed = false;

let renderFps = 60;
let renderStart = 0;
let renderFrameDuration = 1000/renderFps;

const fps = 60;
let previous = 0; 
const frameDuration = 1000/fps;
let lag = 0;

//Game Loop
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

  //Logic
  while (lag >= frameDuration) {
    update();
    lag -= frameDuration;
  }
  
  //Rendering
  let lagOffset = lag / frameDuration;
  if (timestamp >= renderStart) {
    renderWithInterpolation(lagOffset);
    renderStart = timestamp + renderFrameDuration;
  }
  previous = timestamp;
}