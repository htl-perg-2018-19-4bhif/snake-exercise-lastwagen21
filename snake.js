var ansi = require('ansi');
var keypress = require('keypress');

//Cursor verstecken 
const cliCursor = require ('cli-cursor');
cliCursor.hide();

keypress(process.stdin);
process.stdin.setRawMode(true);

var cursor = ansi(process.stdout);
var width = 20; //Breite von Spielfeld
var height = 10; //Höhe von Spielfeld
var posX = 0;
var posY = 0;
var applePosX = 0;
var applePosY = 0;
var dirX = 1;
var dirY = 0;
var points = 0;
var speed = 1;

// clear output
process.stdout.write('\x1Bc');


// Spielbereich zeichnen
cursor.bg.grey();
drawHorizontalLine(1, 1, width);
drawHorizontalLine(1, height, width);
drawVerticalLine(1, 1, height);
drawVerticalLine(width, 1, height);
cursor.bg.reset();

// Eingabemöglichkeit
process.stdin.on('keypress', handleInput);

// Startposition von der Schlange berechnen
posX = Math.floor(width / 2);
posY = Math.floor(height / 2);

// ersten Apfel zufällig zeichnen
drawApple();

//Starte gameLoop der nur beendet werden kann wenn
//man das Spiel verliert. Also wenn die 
//Schlange den Rahmen berührt
gameLoop();    

function gameLoop() {
    // remove snake at old position
    removeSnake(posX, posY);

    // set new position
    posX = posX + dirX;
    posY = posY + dirY;

    // check new position
    if (posX == 1 || posX == width || posY == 1 || posY == height) {
        cursor.red();
        cursor.bg.white();
        setText(width / 2 - 6, height / 2, "  GAME OVER  ");
        quitGame();
    }

    //Schlange hat Apfel erwischt
    if (posX == applePosX && posY == applePosY) {
        //Punkte erhöhen
        points++;

        //Geschwindigkeit erhöhen
        speed++;
        
        //da der Apfel gefunden wurde, braucht man jetzt einen neuen
        drawApple();
    }

    // draw snake at new position
    drawSnake();

    // call gameLoop
    setTimeout(gameLoop, 500/speed);
}

function quitGame() {
    cursor.reset();
    cursor.bg.reset();
    process.stderr.write('\x1B[?25h');
    cursor.goto(1, height + 4);
    process.exit();
}

function handleInput(chunk, key) {
    if (key.name == 'right') {
        dirX = 1;
        dirY = 0;
    } else if (key.name == 'left') {
        dirX = -1;
        dirY = 0;
    } else if (key.name == 'up') {
        dirX = 0;
        dirY = -1;
    } else if (key.name == 'down') {
        dirX = 0;
        dirY = 1;
    }
}

function drawApple() {
    applePosX = Math.ceil(Math.random() * (width - 2)) + 1;
    applePosY = Math.ceil(Math.random() * (height - 2)) + 1;

    cursor.bg.red();
    drawPoint(applePosX, applePosY);
    cursor.bg.reset();

    setText(1, height + 2, "Points: " + points.toString());
    setText(1, height + 3, "Speed: " + speed.toString());
}

function removeSnake() {
    cursor.bg.black();
    drawPoint(posX, posY);
    cursor.bg.reset();
}

//Schlange Zeichnen
function drawSnake() {
    cursor.bg.blue();
    drawPoint(posX, posY);
    cursor.bg.reset();
}

function drawPoint(col, row, char) {
    cursor.goto(col, row).write(' ');
}

function drawHorizontalLine(col, row, length) {
    for (var i = 0; i < length; i++) {
        cursor.goto(col + i, row).write(' ');
    }
}

function drawVerticalLine(col, row, length) {
    for (var i = 0; i < length; i++) {
        cursor.goto(col, row + i).write(' ');
    }
}

function setText(col, row, text) {
    cursor.goto(col, row).write(text);
}