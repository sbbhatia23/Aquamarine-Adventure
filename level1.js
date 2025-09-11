/**
 * Title: Underwater Adventure
 * Author: Sarita
 * Date: 8/12/25
 *
 * AI Usage Statement:
 * This project includes AI-assisted elements. I used ChatGPT
 * to figure out how to scale and keep the sketch interactive.
 * The AI-generated content was reviewed, edited, and integrated by me.
 * Link to AI transcript: https://chatgpt.com/share/68c312ae-df84-8007-9b96-34ce723bf5c7
 https://chatgpt.com/share/68c3139b-dbe0-8007-93f4-1dbaa7796f32
 */
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
let pauseBtn, playBtn;

let levelMessages = [
  "Hi! I am Whisker - a very trustworthy sailor... Can you help me collect some bait for our long journey down below?",
  "Amazing!! We are all set for our journey below. In order to dive in with our trusty Submarine we need to clear off the barnacles! All hands on deck!!",
  "Wow its gorgeous down here - there are so many creatures. Can you help me collect some jellyfish friends to light our way as we venture farther?",
  "We are almost there! I don't want to show up empty-handed to Capy's house! Lets collect some treasure for her...",
  "We made it! Capy says to gather some seaweed for our feast - lets search around!"
];

function preload() {
  whiskerImg = loadImage("assets/whiskers.png");
  endingImg = loadImage("assets/end.png");

  levels[1] = {
    bg: loadImage("assets/firstlevel.png"),
    icons: [loadImage("assets/worm1.png"), loadImage("assets/worm2.png")],
    objectCount: 8
  };
  levels[2] = {
    bg: loadImage("assets/secondlevel.png"),
    icons: [loadImage("assets/barnacle.png"), loadImage("assets/barnacle2.png"), loadImage("assets/barnacle3.png")],
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

  triggerDialogue(); // Start intro
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

  if (!showingDialogue) placeObjects();
}

// -------------------- Dialogue --------------------
function triggerDialogue() {
  showingDialogue = true;
  dialogueText = "";
  dialogueIndex = 0;
  lastCharTime = millis();
}

function drawDialogue() {
  fill(255, 150);
  rect(0, 0, width, height);

  image(whiskerImg, 60 * scaleFactor, height - 260 * scaleFactor, 180 * scaleFactor, 180 * scaleFactor);

  fill(255);
  stroke(0);
  strokeWeight(2);
  rect(280 * scaleFactor, height - 220 * scaleFactor, (width - 340) * scaleFactor, 160 * scaleFactor, 20 * scaleFactor);

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

function finishDialogue() {
  showingDialogue = false;
  objectsFound = 0;
  placeObjects();
}

// -------------------- Objects --------------------
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

      let objW = img.width * 0.3 * scaleFactor;
      let objH = img.height * 0.3 * scaleFactor;

      // Random position in pixels
      let objX = random(0 + objW, width - objW);
      let objY = random(0 + objH, height - objH);

      // Check overlap
      let overlap = false;
      for (let other of objects) {
        let distance = dist(objX, objY, other.x, other.y);
        if (distance < max(objW, objH) * 0.6) {
          overlap = true;
          break;
        }
      }

      if (!overlap) {
        objects.push({ img, x: objX, y: objY, w: objW, h: objH, found: false });
        placed = true;
      }
    }
  }
}

function drawLevel() {
  let level = levels[currentLevel];
  if (!level) {
    background(255);
    if (endingImg) image(endingImg, 0, 0, width, height);
    else {
      fill(0);
      textSize(36 * scaleFactor);
      textAlign(CENTER, CENTER);
      text("🎉 The End! Thanks for playing!", width / 2, height / 2);
    }
    return;
  }

  image(level.bg, 0, 0, width, height); // full screen background

  for (let obj of objects) {
    if (obj.found) continue;

    if (mouseX > obj.x && mouseX < obj.x + obj.w &&
        mouseY > obj.y && mouseY < obj.y + obj.h) {
      push();
      tint(255, 220);
      image(obj.img, obj.x - 3, obj.y - 3, obj.w + 6, obj.h + 6);
      pop();
    } else {
      image(obj.img, obj.x, obj.y, obj.w, obj.h);
    }
  }

  fill(255);
  stroke(0);
  strokeWeight(2);
  textSize(24 * scaleFactor);
  textAlign(LEFT, TOP);
  text(`Objects Found: ${objectsFound} / ${level.objectCount}`, 20 * scaleFactor, 20 * scaleFactor);
}

function mousePressed() {
  if (showingDialogue) return;

  for (let obj of objects) {
    if (obj.found) continue;

    if (mouseX > obj.x && mouseX < obj.x + obj.w &&
        mouseY > obj.y && mouseY < obj.y + obj.h) {
      obj.found = true;
      objectsFound++;

      if (objectsFound >= levels[currentLevel].objectCount) {
        currentLevel++;
        if (currentLevel <= 5) triggerDialogue();
      }
    }
  }
}

