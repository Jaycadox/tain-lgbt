size = 600;
middle = size / 2;
paddleWidth = 100;
paddleHeight = 15;
ballSpeed = 4;
paddleX = 0;
ballRad = 20;
hballRad = ballRad / 2;

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

let ball;
function createBall() {
  ball = {
    x: middle,
    y: middle,
    angle: 135,
  };
}

function bounceY() {
  clack.play();
  ball.angle = 360 - ball.angle + random(-5, 5);
  if(ball.angle % 90 == 0) ball.angle += 3;
}

function bounceX() {
  clack.play();
  ball.angle = 180 - ball.angle + random(-5, 5);
  if(ball.angle % 90 == 0) ball.angle += 3;
}

function ballTouchingWall() {
  if (ball.y > size) reset();
  if (ball.y - hballRad < 0) {
    bounceY();
  }
  if (ball.x - hballRad < 0 || ball.x + hballRad > size) {
    bounceX();
  }
}
let prideFlag;
function reset() {
  paddleX = 50;
  createBall();
  targets = [];
  ballSpeed = 4;
  colours = [
    {r: 255, g: 0, b: 0, a: 255},
    {r: 255, g: 0, b: 0, a: 255},
    {r: 255, g: 141, b: 0, a: 255},
    {r: 255, g: 141, b: 0, a: 255},
    {r: 255, g: 238, b: 0, a: 255},
    {r: 255, g: 238, b: 0, a: 255},
    {r: 0, g: 129, b: 33, a: 255},
    {r: 0, g: 129, b: 33, a: 255},
    {r: 0, g: 76, b: 255, a: 255},
    {r: 0, g: 76, b: 255, a: 255},
    {r: 118, g: 1, b: 136, a: 255},
    {r: 118, g: 1, b: 136, a: 255},
  ];
  ind = 0;
  for(y = 50; y <= 270; y += 20)
  {
    for(i = 0; i <= 12; i ++)
    {
      createTarget(y, 100, 10, 10, i, colours[ind]);
    }
    ind++;
  }
}

function collidePasted(r1, r2) {
  var dx = r1.x + r1.w / 2 - (r2.x + r2.w / 2);
  var dy = r1.y + r1.h / 2 - (r2.y + r2.h / 2);
  var width = (r1.w + r2.w) / 2;
  var height = (r1.h + r2.h) / 2;
  var crossWidth = width * dy;
  var crossHeight = height * dx;
  var collision = "none";
  //
  if (Math.abs(dx) <= width && Math.abs(dy) <= height) {
    if (crossWidth > crossHeight) {
      collision = crossWidth > -crossHeight ? "bottom" : "left";
    } else {
      collision = crossWidth > -crossHeight ? "right" : "top";
    }
  }
  return collision;
}

function collision(
  x1,
  y1,
  height1,
  width1,
  x2,
  y2,
  height2,
  width2,
  correction
) {
  result = collidePasted(
    { x: x2, y: y2, w: width2, h: height2 },
    { x: x1, y: y1, w: width1, h: height1 }
  );
  if (result === "none") return false;
  if (result === "left" || result === "right") {
    bounceX();
  } else {
    bounceY();
  }
  if (correction) ball.y = size - 60;
  return true;
}

targets = [];
toBeDestroyed = [];
idCount = 0;
function createTarget(y, wallPadding, betweenPadding, amt, index, colour) {
  xpos = wallPadding/2 + (calculateLength(wallPadding, betweenPadding, amt) + betweenPadding) * index;
  targets.push({
    x: xpos,
    y: y,
    id: idCount++,
    width: calculateLength(100, 5, 5) - betweenPadding*4,
    r: colour.r,
    g: colour.g,
    b: colour.b,
    a: colour.a,
  });
}

function ballTouchingPaddle() {
  collision(
    ball.x,
    ball.y,
    hballRad,
    hballRad,
    paddleX,
    size - 50,
    paddleHeight,
    paddleWidth,
    true
  );
}

function moveBall() {
  xVel = cos((ball.angle * Math.PI) / 180);
  yVel = sin((ball.angle * Math.PI) / 180);
  ball.x += ballSpeed * xVel;
  ball.y += ballSpeed * yVel;
  ballTouchingWall();
  ballTouchingPaddle();
}

function physics() {
  moveBall();
}

let clack;
let bg;
let face;
function setup() {
  createCanvas(size, size, WEBGL);
  clack = loadSound("clack-1.wav");
  prideFlag = loadImage("pride-flag.png")
  bg = loadImage("back.png")
  face = loadImage("f4.png");
  reset();
  frameRate(60);
}

function calculateLength(wallPadding, betweenPadding, wantedCount) {
  return (size - wallPadding * 2 - betweenPadding * wantedCount) / wantedCount;
}

function draw() {
  translate(-size/2, -size/2)
  physics();

  texture(bg);
  rect(0, 0, size);
  noStroke();
  
  targets.forEach((target) => {
    
    if (
      collision(
        ball.x,
        ball.y,
        hballRad,
        hballRad,
        target.x,
        target.y,
        10,
        target.width,
        false
      )
    )
      toBeDestroyed.push(target.id);
    fill(target.r, target.g, target.b, target.a);
    rect(target.x, target.y, target.width, 10);
  });
  fill(255, 0, 0);
  targets = targets.filter((target) => {
    return !toBeDestroyed.includes(target.id);
  });
  texture(prideFlag)
  rect(paddleX, size - 50, paddleWidth, paddleHeight);
  texture(face)
  circle(ball.x, ball.y, ballRad);
  if (keyIsDown(LEFT_ARROW)) {
    paddleX -= 0.4 * deltaTime;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    paddleX += 0.4 * deltaTime;
  }
  if(targets.length === 0)
  {
    ballSpeed = 0;
    textSize(32);
    text('You won!', 10, 30);
  }
  paddleX = clamp(paddleX, 0, size - paddleWidth);
}
