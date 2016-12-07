/* ; (function (global, myGame, undefined) {
    'use strict';

    // Return a 'new' object
    var myGame = function () {
        return new Greetr.init(firstName, lastName, language);
    }
    var instance;

    function init() {

    }

    myGame.getInstance = function () {
        if (!instance) {
            instance = init();
        }
        return instance;
    };


    global.myGame = myGame;

    return {
        a: '1'
    };

})(window, window.myGame = window.myGame || ''); */


let canvas;
let canvasContext;
let ballX = 50;
let ballY = 50;
let ballSpeedX = 5;
let ballSpeedY = 4;

let player1Score = 0;
let player2Score = 0;
const WINNING_SCORE = 3;

let showingWinScreen = false;

let paddle1Y = 250;
let paddle2Y = 250;
const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 10;

function calculateMousePos(evt) {
  const rect = canvas.getBoundingClientRect();
  const root = document.documentElement;
  const mouseX = evt.clientX - rect.left - root.scrollLeft;
  const mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY,
  };
}

window.onload = function () {
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');
  setMyInterval();

  canvas.addEventListener('mousemove', (evt) => {
    const mousePos = calculateMousePos(evt);
    paddle1Y = mousePos.y - (PADDLE_HEIGHT / 2);
  });

  canvas.addEventListener('mousedown', handleMouseClick);
};

function handleMouseClick(evt) {
  if (showingWinScreen) {
    player1Score = 0;
    player2Score = 0;
    showingWinScreen = false;
  }
}

function setMyInterval() {
  const fps = 30;
  moveEverything();
  drawEveryThing();
  setTimeout(setMyInterval, 1000 / fps);
}


function ballReset() {
  if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
    showingWinScreen = true;
  }

  ballSpeedX = -ballSpeedX;
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
}

function computerMovement() {
  const paddle2YCenter = paddle2Y + (PADDLE_HEIGHT / 2);

  if (paddle2YCenter < ballY - 35) {
    paddle2Y += 6;
  } else if (paddle2YCenter > ballY + 35) {
    paddle2Y -= 6;
  }
}

function moveEverything() {
  if (showingWinScreen) {
    return;
  }
  computerMovement();

  ballX += ballSpeedX;
  ballY += ballSpeedY;
  console.log(ballY);


  if (ballX > canvas.width) {
    // ballSpeedX = -ballSpeedX;
    if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;
      var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.35;
    } else {
      player1Score++;
      ballReset();
    }
  } else if (ballX < 0) {
    // ballSpeedX = -ballSpeedX;
    if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;

      var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.35;
    } else {
      player2Score++;
      ballReset();
    }
  }

  if (ballY < 0) {
    ballSpeedY = -ballSpeedY;
  } else if (ballY > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }
}

function drawNet() {
  for (let i = 0; i < canvas.height; i += 40) {
    colorRect(canvas.width / 2 - 1, i, 2, 20, 'white');
  }
}

function drawEveryThing() {
  colorRect(0, 0, canvas.width, canvas.height, 'black');

  if (showingWinScreen) {
    canvasContext.fillStyle = 'white';

    if (player1Score >= WINNING_SCORE) {
      canvasContext.fillText('Left Player won', 350, 200);
    } else if (player2Score >= WINNING_SCORE) {
      canvasContext.fillText('Right player won', 350, 200);
    }
    canvasContext.fillText('Click to continue', 350, 500);
    return;
  }

  drawNet();

  // Left player paddle
  colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');

  // Right player paddle
  colorRect(canvas.width - PADDLE_THICKNESS, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');

  colorCircle(ballX, ballY, 10, 'white');


  canvasContext.fillText(player1Score, 100, 100);
  canvasContext.fillText(player2Score, canvas.width - 100, 100);
}

function colorCircle(centerX, centerY, radius, drawColor) {
  // Ball
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
  canvasContext.fill();
}


function colorRect(leftX, topY, width, height, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);
}