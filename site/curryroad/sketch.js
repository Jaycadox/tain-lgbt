canvasDim = 600;
playerSize = 30;

screenMiddle = canvasDim / 2 - playerSize / 2;

playerY = canvasDim - playerSize - 8;
playerX = canvasDim - playerSize - screenMiddle;

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);






function doesColide(x, y, x2, y2, radius) {
    if (abs(x2 - x) > radius) return false;
    return abs(y - y2) < radius
}
enemyX = screenMiddle;
mode = false;

enemies = []

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

idCount = 0

rowTimings = [Date.now(), Date.now(), Date.now(), Date.now(), Date.now(), Date.now()]
rowDirection = [0, 1, 0, 1, 0, 1]
rowSpeed = [0.85, 0.75, 0.65, 0.55, 0.43, 0.36, 0.3]

function reset() {
    rowTimings = [Date.now(), Date.now(), Date.now(), Date.now(), Date.now(), Date.now()]
    rowDirection = [0, 1, 0, 1, 0, 1]
    rowSpeed = [0.85, 0.75, 0.65, 0.55, 0.43, 0.36, 0.3]
    idCount = 0
    enemies = []
    playerY = canvasDim - playerSize - 8;
    playerX = canvasDim - playerSize - screenMiddle;
    idsToBeTerminated = []
}

let spawnRate = 0.3;
let spawnDelay = 210;

function createRandomEnemy() {
    iMode = Math.random() < 0.5
    iRow = randomIntFromInterval(1, 6);
    if (rowDirection[iRow - 1] !== -1) {
        iMode = rowDirection[iRow - 1] === 1;
    }
    if (rowTimings[iRow - 1] + spawnDelay > Date.now()) return;
    rowTimings[iRow - 1] = Date.now();
    const index = rowTimings.indexOf(min);
    enemies.push({
        mode: iMode,
        xPos: !iMode ? canvasDim : -30,
        row: iRow,
        id: idCount
    });
    idCount++;
}
let tainFace;
let prideFlag;
let curryStore;
let font;
let backg;
let easyMode;
let normalMode;
let hardMode;
let chadMode;
let diffText = "Difficulty: normal";

function changeDifficulty(ispawnrate, idelay, text) {
    spawnRate = ispawnrate;
    spawnDelay = idelay;
    diffText = "Difficulty: " + text;
    reset();
}

function setup() {
    createCanvas(canvasDim, canvasDim, WEBGL);
    createRandomEnemy();
    frameRate(60);
    tainFace = loadImage('f4.png');
    prideFlag = loadImage('pride-flag.png');
    curryStore = loadImage('curry-store.png');
    backg = loadImage('back.png');
    font = loadFont('font.ttf');

    easyMode = createButton('Easy Mode');
    easyMode.position(10, 10);
    normalMode = createButton('Normal Mode');
    normalMode.position(10, 35);
    hardMode = createButton('Hard Mode');
    hardMode.position(10, 60);
    chadMode = createButton('chad Mode');
    chadMode.position(10, 85);
    easyMode.mousePressed(() => { changeDifficulty(0.2, 280, "easy") });
    normalMode.mousePressed(() => { changeDifficulty(0.3, 210, "normal") });
    hardMode.mousePressed(() => { changeDifficulty(0.7, 100, "hard") });
    chadMode.mousePressed(() => { changeDifficulty(0.99, 50, "chad") });

    while (!font) {}
    reset();
}

function getRowY(row) {
    return 100 + row * 70;
}

function pause(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}



function draw() {
    textFont(font);
    textSize(width / 8);
    textAlign(CENTER, CENTER);
    translate(-canvasDim / 2, -canvasDim / 2)
    texture(backg);
    rect(0, 0, canvasDim);
    //background(200, 255, 200)
    if (Math.random() < spawnRate) {
        createRandomEnemy();
    }
    noStroke()
    fill(30, 30, 40, 150);
    rect(0, getRowY(1), canvasDim, 35)
    rect(0, getRowY(2), canvasDim, 35)
    rect(0, getRowY(3), canvasDim, 35)
    rect(0, getRowY(4), canvasDim, 35)
    rect(0, getRowY(5), canvasDim, 35)
    rect(0, getRowY(6), canvasDim, 35)
    fill(170, 170, 170);
    collidingThisFrame = false;
    enemies.forEach((enemy) => {
        noStroke()
        texture(prideFlag);
        rect(enemy.xPos, getRowY(enemy.row) + 2.5, 30)
        if (doesColide(playerX, playerY, enemy.xPos, getRowY(enemy.row) + 2.5, 31)) {
            collidingThisFrame = true;
        }
        if (!enemy.mode) {
            enemy.xPos -= rowSpeed[enemy.row - 1] * deltaTime;
            if (enemy.xPos < -30) {
                idsToBeTerminated.push(enemy.id)
            }
        } else {
            enemy.xPos += rowSpeed[enemy.row - 1] * deltaTime;
            if (enemy.xPos > canvasDim) {
                idsToBeTerminated.push(enemy.id)
            }
        }
    });
    enemies = enemies.filter(function(e) {
        return !idsToBeTerminated.includes(e.id)
    });
    if (collidingThisFrame) {
        fill(255, 0, 0);
        pause(500);
        timeNow = Date.now();
        while (Date.now() < timeNow + 200) {}
        reset();
    } else {
        fill(170, 170, 170);
    }
    noStroke()
    texture(curryStore);
    rect(screenMiddle - 150 / 2, 15, 150)
    texture(tainFace);
    rect(playerX, playerY, playerSize)
    if (playerY < getRowY(0) + 50) {
        let time = millis() % 100;
        textSize(width / 8);
        text('YUMMY', canvasDim / 2, 200);
    }
    textSize(width / 32);
    text('WASD/arrows to move', 100, 130);
    text(diffText, 100, 150);
    if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
        playerY -= 0.17 * deltaTime;
    }
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
        playerX -= 0.17 * deltaTime;
    }
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
        playerX += 0.17 * deltaTime;
    }
    if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
        playerY += 0.17 * deltaTime;
    }
    playerY = clamp(playerY, 0, canvasDim - playerSize)
    playerX = clamp(playerX, 0, canvasDim - playerSize)
}