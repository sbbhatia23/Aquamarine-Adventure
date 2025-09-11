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

let currentLevel = 1;
let levels = {};
let objects = [];
let objectsFound = 0;
let scaleFactor;
let endingImg;

// Dialogue variables
let showingDialogue = false;
let dialogueText = "";
let dialogueIndex = 0;
let lastCharTime = 0;
let charSpeed = 40;
let whiskerImg;
let pauseImg, playImg, pauseBtn, playBtn;

let levelMessages = [
  "Hi! I am Whisker - a very trustworthy sailor... Can you help me collect some bait for our long journey down below?",
  "Amazing!! We are all set for our journey below. In order to dive in with our trusty Submarine we need to clear off the barnacles! All hands on deck!!",
  "Wow its gorgeous down here - there are so many creatures. Can you help me collect some jellyfish friends to light our way as we venture farther?",
  "We are almost there! I don't want to show up empty-handed to Capy's house! Lets collect some treasure for her...",
  "We made it! Capy says to gather some seaweed for our feast - lets search around!"
];

function preload() {
  pauseImg = loadImage("assets/icons/pause.png");
  playImg = loadImage("assets/icons/play.png");
  whiskerImg = loadImage("assets/whiskers.png");
endingImg = loadImage("assets/end.jpg");
  // Levels setup
  levels[1] = {
    bg: loadImage("assets/firstlevel.png"),
    icons: [loadImage("assets/icons/worm1.png"), loadImage("assets/icons/worm2.png")],
    objectCount: 8
  };
  levels[2] = {
    bg: loadImage("assets/secondlevel.png"),
    icons: [loadImage("assets/icons/barnacle.png"), loadImage("assets/icons/barnacle2.png"), loadImage("assets/icons/barnacle3.png")],
    objectCount: 10
  };
  levels[3] = {
    bg: loadImage("assets/third.png"),
    icons: [loadImage("assets/jelly.png"), loadImage("assets/jelly2.png")],
    objectCount: 12
  };
  levels[4] = {
    bg: loadImage("assets/fourth.png"),
    icons: [loadImage("assets/pearl.png"), loadImage("assets/jewel.png"), loadImage("assets/chain.png")],
    objectCount: 13
  };
  levels[5] = {
    bg: loadImage("assets/fifth.png"),
    icons: [loadImage("assets/sea.png"), loadImage("assets/seaweed.png")],
    objectCount: 14
  };
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  scaleFactor = min(width / 1920, height / 1080);

  // Pause/Play buttons
  pauseBtn = createImg("assets/icons/pause.png");
  pauseBtn.position(20 * scaleFactor, height - 60 * scaleFactor);
  pauseBtn.size(50 * scaleFactor, 50 * scaleFactor);
  pauseBtn.mousePressed(pauseDialogue);

  playBtn = createImg("assets/icons/play.png");
  playBtn.position(80 * scaleFactor, height - 60 * scaleFactor);
  playBtn.size(50 * scaleFactor, 50 * scaleFactor);
  playBtn.mousePressed(finishDialogue);
  playBtn.hide();

  triggerDialogue(); // Start intro

  const bgMusic = document.getElementById("bgMusic");
const volumeSlider = document.getElementById("volumeSlider");

bgMusic.volume = parseFloat(volumeSlider.value);

// Play on first click/touch
function startMusic() {
  if (bgMusic.paused) bgMusic.play();
  window.removeEventListener('click', startMusic);
  window.removeEventListener('touchstart', startMusic);
}
window.addEventListener('click', startMusic);
window.addEventListener('touchstart', startMusic);

// Update volume in real time
volumeSlider.addEventListener("input", () => {
  bgMusic.volume = parseFloat(volumeSlider.value);
});
}

function draw() {
  if (showingDialogue) {
    drawDialogue();
  } else {
    drawLevel();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  scaleFactor = min(width / 1920, height / 1080);

  pauseBtn.position(20 * scaleFactor, height - 60 * scaleFactor);
  pauseBtn.size(50 * scaleFactor, 50 * scaleFactor);

  playBtn.position(80 * scaleFactor, height - 60 * scaleFactor);
  playBtn.size(50 * scaleFactor, 50 * scaleFactor);

  if (!showingDialogue) placeObjects();
}

// -------------------- Dialogue --------------------
function triggerDialogue() {
  showingDialogue = true;
  dialogueText = "";
  dialogueIndex = 0;
  lastCharTime = millis();
  pauseBtn.show();
  playBtn.show();
}

function drawDialogue() {
  // Transparent overlay
  fill(255, 150);
  rect(0, 0, width, height);

  // Whisker portrait
  image(whiskerImg, 60 * scaleFactor, height - 260 * scaleFactor, 180 * scaleFactor, 180 * scaleFactor);

  // Speech bubble
  fill(255);
  stroke(0);
  strokeWeight(2);
  rect(280 * scaleFactor, height - 220 * scaleFactor, (width - 340) * scaleFactor, 160 * scaleFactor, 20 * scaleFactor);

  // Typewriter text
  let fullMsg = levelMessages[currentLevel - 1];
  if (dialogueIndex < fullMsg.length && millis() - lastCharTime > charSpeed) {
    dialogueText += fullMsg.charAt(dialogueIndex);
    dialogueIndex++;
    lastCharTime = millis();
  }

  fill(0);
  noStroke();
  textSize(18 * scaleFactor);
  textAlign(LEFT, TOP);
  text(dialogueText, 300 * scaleFactor, height - 200 * scaleFactor, (width - 380) * scaleFactor, 140 * scaleFactor);
}

function pauseDialogue() {
  noLoop();
}

function finishDialogue() {
  loop();
  playBtn.hide();
  let fullMsg = levelMessages[currentLevel - 1];
  dialogueText = fullMsg;
  dialogueIndex = fullMsg.length;

  showingDialogue = false;
  objectsFound = 0;
  placeObjects();
}


function placeObjects() {
  let level = levels[currentLevel];
  objects = [];
  let maxAttempts = 200;

  for (let i = 0; i < level.objectCount; i++) {
    let placed = false;
    let attempts = 0;

    while (!placed && attempts < maxAttempts) {
      attempts++;
      let img = random(level.icons);

      // Random positions based on full canvas now
      let xPercent = random(5, 95);  // percentage of canvas width
      let yPercent = random(5, 95);  // percentage of canvas height

      let objW = img.width * 0.3 * scaleFactor;
      let objH = img.height * 0.3 * scaleFactor;

      let overlap = false;
      for (let other of objects) {
        let dx = ((xPercent - other.xPercent) / 100) * width;
        let dy = ((yPercent - other.yPercent) / 100) * height;
        let distance = dist(0, 0, dx, dy);
        let minDist = max(objW, objH) * 0.6;
        if (distance < minDist) {
          overlap = true;
          break;
        }
      }

      if (!overlap) {
        objects.push({ img, xPercent, yPercent, found: false });
        placed = true;
      }
    }
  }
}


function drawLevel() {
  let level = levels[currentLevel];

  // If no more levels, show ending image
  if (!level) {
    background(255); // white background
    if (endingImg) {
      image(endingImg, 0, 0, width, height);
    } else {
      fill(0);
      textSize(36 * scaleFactor);
      textAlign(CENTER, CENTER);
      text("🎉 The End! Thanks for playing!", width / 2, height / 2);
    }
    return;
  }

  // Draw background stretched to fill canvas
  image(level.bg, 0, 0, width, height);

  // Draw objects
  for (let obj of objects) {
    if (obj.found) continue;

    let objX = (obj.xPercent / 100) * width;
    let objY = (obj.yPercent / 100) * height;
    let objW = obj.img.width * 0.3 * scaleFactor;
    let objH = obj.img.height * 0.3 * scaleFactor;

    // Highlight object on hover
    if (mouseX > objX && mouseX < objX + objW &&
        mouseY > objY && mouseY < objY + objH) {
      push();
      tint(255, 220);
      image(obj.img, objX - 3, objY - 3, objW + 6, objH + 6);
      pop();
    } else {
      image(obj.img, objX, objY, objW, objH);
    }
  }

  // Display counter
  fill(255);
  stroke(0);
  strokeWeight(2);
  textSize(24 * scaleFactor);
  textAlign(LEFT, TOP);
  text(`Objects Found: ${objectsFound} / ${level.objectCount}`, 20 * scaleFactor, 20 * scaleFactor);
}


function mousePressed() {
  if (showingDialogue) return;

  let level = levels[currentLevel];
  if (!level) return;

  for (let obj of objects) {
    if (obj.found) continue;

    // Position based on full canvas
    let objX = (obj.xPercent / 100) * width;
    let objY = (obj.yPercent / 100) * height;
    let objW = obj.img.width * 0.3 * scaleFactor;
    let objH = obj.img.height * 0.3 * scaleFactor;

    if (mouseX > objX && mouseX < objX + objW &&
        mouseY > objY && mouseY < objY + objH) {
      obj.found = true;
      objectsFound++;

      if (objectsFound >= level.objectCount) {
        currentLevel++;
        if (currentLevel <= 5) {
          triggerDialogue();
        }
      }
    }
  }
}
