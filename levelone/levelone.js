let bg;
let wormImgs = [];
let worms = [];
let wormCount = 8;
let wormsFound = 0;

// Scaling variables
let bgAspectRatio;
let scaleFactor;

function preload() {
  bg = loadImage("assets/firstlevel.png");
  wormImgs[0] = loadImage("assets/worm1.png");
  wormImgs[1] = loadImage("assets/worm2.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  bgAspectRatio = bg.width / bg.height;

  placeWorms();
}

function placeWorms() {
  worms = [];
  let maxAttempts = 200; // To prevent infinite loops

  for (let i = 0; i < wormCount; i++) {
    let placed = false;
    let attempts = 0;

    while (!placed && attempts < maxAttempts) {
      attempts++;

      let img = random(wormImgs);
      let xPercent = random(10, 85);
      let yPercent = random(15, 80);

      let wormW = img.width * 0.3;
      let wormH = img.height * 0.3;

      // Check overlap with existing worms
      let overlap = false;
      for (let other of worms) {
        let dx = (xPercent - other.xPercent) / 100 * width;
        let dy = (yPercent - other.yPercent) / 100 * height;
        let distance = dist(0, 0, dx, dy);

        // Minimum spacing based on worm size + padding
        let minDist = max(wormW, wormH) * 0.6;
        if (distance < minDist) {
          overlap = true;
          break;
        }
      }

      // If no overlap, place the worm
      if (!overlap) {
        worms.push({
          img: img,
          xPercent: xPercent,
          yPercent: yPercent,
          found: false
        });
        placed = true;
      }
    }
  }
}

function draw() {
  // Draw background scaled to fill window without distortion
  let canvasAspectRatio = width / height;
  if (canvasAspectRatio > bgAspectRatio) {
    let scaledWidth = height * bgAspectRatio;
    image(bg, (width - scaledWidth) / 2, 0, scaledWidth, height);
  } else {
    let scaledHeight = width / bgAspectRatio;
    image(bg, 0, (height - scaledHeight) / 2, width, scaledHeight);
  }

  // Worm scaling factor
  scaleFactor = min(width, height) / 800;

  // Draw worms
  for (let worm of worms) {
    if (worm.found) continue;

    let wormX = (worm.xPercent / 100) * width;
    let wormY = (worm.yPercent / 100) * height;
    let wormW = worm.img.width * 0.3 * scaleFactor;
    let wormH = worm.img.height * 0.3 * scaleFactor;

    // Hover glow effect
    if (mouseX > wormX && mouseX < wormX + wormW &&
        mouseY > wormY && mouseY < wormY + wormH) {
      push();
      tint(255, 220);
      image(worm.img, wormX - 3, wormY - 3, wormW + 6, wormH + 6);
      pop();
    } else {
      image(worm.img, wormX, wormY, wormW, wormH);
    }
  }
}

function mousePressed() {
  for (let worm of worms) {
    if (worm.found) continue;

    let wormX = (worm.xPercent / 100) * width;
    let wormY = (worm.yPercent / 100) * height;
    let wormW = worm.img.width * 0.3 * scaleFactor;
    let wormH = worm.img.height * 0.3 * scaleFactor;

    if (mouseX > wormX && mouseX < wormX + wormW &&
        mouseY > wormY && mouseY < wormY + wormH) {
      worm.found = true;
      wormsFound++;
      document.getElementById("counter").innerText = `Worms Found: ${wormsFound}`;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  placeWorms(); // Re-scatter worms when resizing
}
