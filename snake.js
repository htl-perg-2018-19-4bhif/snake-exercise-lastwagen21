var ansi = require('ansi');
var keypress = require('keypress');

//Cursor verstecken 
const cliCursor = require ('cli-cursor');
cliCursor.hide();

//Clear CLI
const clear = require('clear');
clear();

keypress(process.stdin);
process.stdin.setRawMode(true);

var cursor = ansi(process.stdout);
var width = 20; //Breite von Spielfeld
var height = 10; //Höhe von Spielfeld
//posX = -1 links bewegen
//posX = 0 Bewgen nach oben oder unten abhängig von posY
//posX = 1 nach rechts Bewegen
var posX = 0;
//posY = -1 nach oben Bewegen
//posY = 0 Bewegung nach links oder rechts duch posX
//posY = 1 nach unten Bewegen
var posY = 0;
var applePosX = 0;
var applePosY = 0;
var dirX = 1;
var dirY = 0;
var points = 0;
var speed = 1;

//Spielbereich zeichnen
cursor.bg.grey();
drawHorizontalLine(1, 1, width);//oberer Rahmen
drawHorizontalLine(1, height, width);//unterer Rahmen
drawVerticalLine(1, 1, height);//linker Rahmen
drawVerticalLine(width, 1, height);//rechter Rahmen
cursor.bg.reset();

//Eingabemöglichkeit
process.stdin.on('keypress', handleInput);

//Startposition von der Schlange berechnen
posX = Math.floor(width / 2);
posY = Math.floor(height / 2);

//ersten Apfel zufällig zeichnen
drawApple();

//Starte gameLoop der nur beendet werden kann wenn
//man das Spiel verliert. Also wenn die 
//Schlange den Rahmen berührt
gameLoop();    

function gameLoop() {
    //Schlange von alter position löschen
    //damit die Schlange nicht länger wird
    removeSnake(posX, posY);

    //Auf neu positon setzen
    posX = posX + dirX;
    posY = posY + dirY;

    //Schauen ob neue position erlaubt ist
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

    //Schlange auf neuer Positon zeichnen
    drawSnake();

    //Aufrufen von gameLoop mit überagabe der Geschwindigkeit
    setTimeout(gameLoop, 2000/speed);
}

//Spiel beenden
function quitGame() {
    cursor.reset();
    cursor.bg.reset();
    cursor.goto(1, height + 4);
    process.exit();
}

//Input überprüfen zum Steuern
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

//Apfel zeichnen
function drawApple() {
    applePosX = Math.ceil(Math.random() * (width - 2)) + 1;
    applePosY = Math.ceil(Math.random() * (height - 2)) + 1;

    cursor.bg.red();
    drawPoint(applePosX, applePosY);
    cursor.bg.reset();

    setText(1, height + 2, "Points: " + points.toString());
    setText(1, height + 3, "Speed: " + speed.toString());
}

//Schlange löschen
function removeSnake() {
    cursor.bg.black();
    drawPoint(posX, posY);
    cursor.bg.reset();
}

//Schlange Zeichnen
function drawSnake() {
    cursor.bg.green();
    drawPoint(posX, posY);
    cursor.bg.reset();
}

function drawPoint(col, row, char) {
    cursor.goto(col, row).write(' ');
}

//Rahmen zeichnen
function drawHorizontalLine(col, row, length) {
    for (var i = 0; i < length; i++) {
        cursor.goto(col + i, row).write(' ');
    }
}

//Rahmen zeichnen
function drawVerticalLine(col, row, length) {
    for (var i = 0; i < length; i++) {
        cursor.goto(col, row + i).write(' ');
    }
}

//Text schreiben mit der Positions übergabe
function setText(col, row, text) {
    cursor.goto(col, row).write(text);
}