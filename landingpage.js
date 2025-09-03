/**
 * Title: Underwater Adventure
 * Author: Sarita
 * Date: 8/12/25
 *
 * AI Usage Statement:
 * This project includes AI-assisted elements. I used ChatGPT
 * to create objects such as the submarine and fish and to give insight on how to make bubbles and fish move.
 * The AI-generated content was reviewed, edited, and integrated by me.
 * Link to AI transcript: https://chatgpt.com/c/689ba778-e794-832c-8a1e-a3373cf902d3
 */
// Cozy Stardew Valley–inspired Submarine Scene with Exploration

let bubbles = [];
let fish = [];
let submarineX, submarineY;
let waveOffset = 0;
let pearls = [];
let pearlCount = 0;
let chestBubbles = [];
let chestSparkles = [];
let chestClosedImg, chestOpenImg;
let chest = { x: 650, y: 500, w: 80, h: 50, open: false };
let textSizeVal = 150; // default pearl counter text size
let currentLevel = 1;
let maxLevels = 10;
let maxPearls = 5 + currentLevel * 2;



function preload() {
  chestClosedImg = loadImage('assets/closedchest.png');
  chestOpenImg = loadImage('assets/openchest.png');
}


function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("sketch-container"); // Attach to container
  submarineX = width / 2;
  submarineY = height / 2;

// Connect slider from HTML
const slider = document.getElementById("text-size");
const sliderVal = document.getElementById("textSizeVal");

slider.addEventListener("input", function() {
  textSizeVal = Number(slider.value); // convert string → number
     // Update pearl counter size
  sliderVal.textContent = slider.value;  // Update displayed number next to slider
});

  // Bubbles
  for (let i = 0; i < 25; i++) {
    bubbles.push(new Bubble(random(width), random(height), random(8, 20)));
  }

  // Fish
  for (let i = 0; i < 10; i++) {
    fish.push(new Fish(random(width), random(height - 200), random(1, 2)));
  }

  // Initialize pearls for level 1
  generatePearls();
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
function drawArrows() {
  push();
  resetMatrix(); // so it stays in the bottom-left corner
  noStroke();
  fill(255); // white arrows
  textSize(32);
  text("← ↓ → ↑", 20, height - 20); // bottom-left corner
  pop();
}

function drawChest() {
  push();
  imageMode(CENTER);
  if (chest.open) {
    image(chestOpenImg, chest.x, chest.y, chest.w, chest.h);
  } else {
    image(chestClosedImg, chest.x, chest.y, chest.w, chest.h);
  }
  pop();

  
}

function draw() {
  drawBackground();


  // Seaweed on bottom
  drawSeaweed();

// Draw treasure chest
drawChest(); // draws your chest image instead of rectangles

  // Fish
  for (let f of fish) {
    f.move();
    f.show();
  }
  
  // Bubbles
  for (let b of bubbles) {
    b.move();
    b.show();
  }

  // Draw pearls
for (let p of pearls) {
  fill(255, 255, 255); // white pearl
  stroke(200);
  strokeWeight(2);
  ellipse(p.x, p.y, p.r);
}

// Draw pearl counter in corner
noStroke();
fill(255);
textSize(Number(textSizeVal));
fill(255);
noStroke();
text("Level: " + currentLevel + " | Pearls: " + pearlCount + "/" + maxPearls, 20, height - 60);




if (chest.open) {
  // Occasionally add a bubble from chest
  if (frameCount % 10 === 0) {
    chestBubbles.push(new Bubble(chest.x + random(-10, 10), chest.y, random(5, 10)));
  }

  // Occasionally add sparkles
  if (frameCount % 15 === 0) {
    chestSparkles.push({ x: chest.x + random(-15, 15), y: chest.y, r: random(3, 6) });
  }

  // Draw chest bubbles
  for (let b of chestBubbles) {
    b.move();
    b.show();
  }

  // Draw sparkles
  for (let s of chestSparkles) {
    noStroke();
    fill(255, 255, 100, 200);
    ellipse(s.x, s.y, s.r);
    s.y -= 1;
    s.x += random(-0.5,0.5);
  }
}


  // Submarine
  drawSubmarine(submarineX, submarineY);

  // Movement controls
  if (keyIsDown(LEFT_ARROW)) submarineX -= 2;
  if (keyIsDown(RIGHT_ARROW)) submarineX += 2;
  if (keyIsDown(UP_ARROW)) submarineY -= 2;
  if (keyIsDown(DOWN_ARROW)) submarineY += 2;
   // Draw counter fixed in corner
  

  waveOffset += 0.01; // gentle motion for seaweed
 drawArrows();
}

function drawBackground() {
  // Gradient ocean background
  for (let y = 0; y < height; y++) {
    let c = lerpColor(color(50, 100, 150), color(20, 50, 90), y / height);
    stroke(c);
    line(0, y, width, y);
  }
  
  // Light rays
  noStroke();
  fill(255, 255, 200, 20);
  for (let i = 0; i < 5; i++) {
    triangle(100 * i, 0, 100 * i + 50, 0, 300 * i - 100, height);
  }
  

}

function drawSeaweed() {
  stroke(40, 100, 50);
  strokeWeight(4);
  noFill();
  for (let x = 30; x < width; x += 30) { // Reduced spacing from 60 → 30 for more grass
    beginShape();
    for (let y = height - 100; y < height; y += 10) {
      let sway = sin(y / 20 + waveOffset) * 5;
      vertex(x + sway, y);
    }
    endShape();
  }
}

function drawSubmarine(x, y) {
  push();
  translate(x, y);
  
  // Subtle bobbing
  let bob = sin(frameCount * 0.02) * 2;
  translate(0, bob);
  
  // Body
  fill(240, 200, 100);
  stroke(150, 120, 50);
  strokeWeight(2);
  ellipse(0, 0, 180, 50);
  
  // Conning tower
  rectMode(CENTER);
  fill(240, 200, 100);
  rect(0, -30, 40, 30, 5);
  
  // Periscope
  fill(150, 120, 50);
  rect(0, -50, 10, 20);
  rect(10, -60, 20, 10);
  
  // Windows
  fill(180, 220, 255);
  stroke(100, 150, 200);
  strokeWeight(2);
  ellipse(-50, 0, 20, 20);
  ellipse(0, 0, 20, 20);
  ellipse(50, 0, 20, 20);
  
  // Propeller
  fill(160, 160, 160);
  ellipse(-95, 0, 10, 25);
  
  pop();
}

// Bubble class
class Bubble {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
  }
  
  move() {
    this.y -= 0.8;
    if (this.y < -this.r) {
      this.y = height + this.r;
      this.x = random(width);
    }
  }
  
  show() {
    noFill();
    stroke(200, 220, 255, 150);
    ellipse(this.x, this.y, this.r);
  }
}

// Fish class
// Fish class
class Fish {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.size = random(20, 40);
    this.color = color(random(150, 255), random(100, 200), random(100, 200));
  }
  
  move() {
    this.x -= this.speed;
    if (this.x < -this.size) {
      this.x = width + this.size;
      this.y = random(height - 200);
    }
  }
  
  show() {
    fill(this.color);
    noStroke();
    ellipse(this.x, this.y, this.size, this.size / 2);
    triangle(this.x - this.size / 2, this.y, this.x - this.size, this.y - 5, this.x - this.size, this.y + 5);
  }

  // ← Add this new method here
  clicked(px, py) {
    let d = dist(px, py, this.x, this.y);
    if (d < this.size / 2) {
      this.color = color(random(150, 255), random(100, 200), random(100, 200));
    }
  }

}

function generatePearls() {
  pearls = [];
  for (let i = 0; i < maxPearls; i++) {
    pearls.push({
      x: random(50, width - 50),
      y: random(100, height - 100),
      r: random(10, 20 - currentLevel) // pearls get smaller at higher levels
    });
  }
}

function showLevelOverlay(level) {
  const overlay = document.getElementById("level-overlay");
  const levelText = document.getElementById("level-text");

  if (overlay && levelText) {
    // Update level number
    levelText.textContent = "Level " + level;

    // Show overlay
    overlay.classList.add("show");

    // Hide overlay after 2 seconds
    setTimeout(() => {
      overlay.classList.remove("show");
    }, 2000);
  }
}

function mousePressed() {
  // Existing fish click code
  for (let f of fish) {
    f.clicked(mouseX, mouseY);
  }

  // Check pearls
  for (let i = pearls.length - 1; i >= 0; i--) { // loop backwards to remove safely
    let p = pearls[i];
    let d = dist(mouseX, mouseY, p.x, p.y);
    if (d < p.r / 2) {
      pearls.splice(i, 1); // remove pearl
      pearlCount++;        // increment counter
    }
   if (pearlCount >= maxPearls) {
  if (currentLevel < maxLevels) {
    currentLevel++;
    maxPearls = 5 + currentLevel * 2;
    pearlCount = 0;
    generatePearls();
    showLevelOverlay(currentLevel);
  } else {
    showLevelOverlay("🏆 You Won!");
    noLoop(); // stop the game
  }
}


  }

  // Check chest
let d = dist(mouseX, mouseY, chest.x, chest.y);
if (d < chest.w/2) {
  chest.open = !chest.open; // toggle open/closed
}



}