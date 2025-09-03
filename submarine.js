let bg;

function preload() {
  bg = loadImage("submarine background.webp"); // Load your image
}
function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("sketch-container"); // Attach to container
  submarineX = width / 2;
  submarineY = height / 2;
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(bg); // Use the image as the background
}
function draw() {
  background(220);
}