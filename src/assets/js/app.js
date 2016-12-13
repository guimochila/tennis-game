var tennisGame = (function () {
  'use strict';

  // Variable for unique instance
  var instance;

  function init() {
    // Private variables
    // Canvas variables
    var _canvas = document.getElementById('tennisCanvas');
    var _canvasContext = _canvas.getContext('2d');

    // Ball control variables
    var _ballX = 50;
    var _ballY = 50;
    var _ballSpeedX = 5;
    var _ballSpeedY = 4;

    // Player scores
    var _player1Score = 0;
    var _player2Score = 0;
    var _winningScore = 3;

    // Define player paddles size
    var _paddle1Y = 250;
    var _paddle2Y = 250;
    var _paddleWeight = 100;
    var _paddleHeight = 10;

    // Calculate mouse position
    function calculateMousePos(e) {
      var rect = _canvas.getBoundingClientRect();
      var root = document.documentElement;
      var mouseX = e.clientX - rect.left - root.scrollLeft;
      var mouseY = e.clientY - rect.top - root.scrollTop;
      return {
        x: mouseX,
        y: mouseY
      };
    }


    function ballReset() {
      if (_player1Score >= _winningScore || _player2Score >= _winningScore) {
        // _showWinScreen = true;
      }

      _ballSpeedX = -_ballSpeedX;
      _ballX = _canvas.width / 2;
      _ballY = _canvas.height / 2;
    }

    function computerMov() {
      const paddle2YCenter = _paddle2Y + (_paddleWeight / 2);

      if (paddle2YCenter < _ballY - 35) {
        _paddle2Y += 6;
      } else if (paddle2YCenter > _ballY + 35) {
        _paddle2Y -= 6;
      }
    }

    // Ball moviments control
    function ballMovControl() {
      var deltaY;
      if (_showWinScreen) {
        return;
      }
      computerMov();

      _ballX += _ballSpeedX;
      _ballY += _ballSpeedY;

      if (_ballX > _canvas.width) {
        // ballSpeedX = -ballSpeedX;

        if (_ballY > _paddle2Y && _ballY < _paddle2Y + _paddleWeight) {
          _ballSpeedX = -_ballSpeedX;
          deltaY = _ballY - (_paddle2Y + (_paddleWeight / 2));
          _ballSpeedY = deltaY * 0.35;
        } else {
          _player1Score += _player1Score;
          ballReset();
        }
      } else if (_ballX < 0) {
        // ballSpeedX = -ballSpeedX;
        if (_ballY > _paddle1Y && _ballY < _paddle1Y + _paddleWeight) {
          _ballSpeedX = -_ballSpeedX;

          deltaY = _ballY - (_paddle1Y + (_paddleWeight / 2));
          _ballSpeedY = deltaY * 0.35;
        } else {
          _player2Score += _player2Score;
          ballReset();
        }
      }

      if (_ballY < 0) {
        _ballSpeedY = -_ballSpeedY;
      } else if (_ballY > _canvas.height) {
        _ballSpeedY = -_ballSpeedY;
      }
    }
    // Private function to paint the canvas
    function paintCanvas(leftX, topY, width, height, drawColor) {
      _canvasContext.fillStyle = drawColor;
      _canvasContext.fillRect(leftX, topY, width, height);
    }

    // Draw in the canvas
    /* function drawCanvas() {
      paintCanvas(0, 0, _canvas.width, _canvas.height, 'black');
    } */

    // Ball
    function colorCircle(centerX, centerY, radius, drawColor) {
      _canvasContext.fillStyle = drawColor;
      _canvasContext.beginPath();
      _canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
      _canvasContext.fill();
    }

    function drawEveryThing() {
      paintCanvas(0, 0, _canvas.width, _canvas.height, 'black');

      if (_showWinScreen) {
        _canvasContext.fillStyle = 'white';

        if (_player1Score >= _winningScore) {
          _canvasContext.fillText('Left Player won', 350, 200);
        } else if (_player2Score >= _winningScore) {
          _canvasContext.fillText('Right player won', 350, 200);
        }
        _canvasContext.fillText('Click to continue', 350, 500);
        return;
      }

      // Draw net
      for (let i = 0; i < _canvas.height; i += 40) {
        paintCanvas((_canvas.width / 2) - 1, i, 2, 20, 'white');
      }

      // Left player paddle
      paintCanvas(0, _paddle1Y, _paddleHeight, _paddleWeight, 'white');

      // Right player paddle
      paintCanvas(_canvas.width - _paddleHeight, _paddle2Y, _paddleHeight, _paddleWeight, 'white');

      colorCircle(_ballX, _ballY, 10, 'white');


      _canvasContext.fillText(_player1Score, 100, 100);
      _canvasContext.fillText(_player2Score, _canvas.width - 100, 100);
    }

    // Mouse click handle
    function handleMouseClick() {
      if (_showWinScreen) {
        _player1Score = 0;
        _player2Score = 0;
        _showWinScreen = false;
      }
    }

    // SetInterval alternative
    function setMyInterval() {
      var fps = 30;
      ballMovControl();
      drawEveryThing();
      setTimeout(setMyInterval, 1000 / fps);
    }

    // Init Instance
    setMyInterval();
    _canvas.addEventListener('mousemove', (e) => {
      const mousePos = calculateMousePos(e);
      _paddle1Y = mousePos.y - (_paddleHeight / 2);
    });

    _canvas.addEventListener('mousedown', handleMouseClick);
  }
  // Returning Instance
  return {

    // Get the Singleton instance if one exists
    // or create one if it doesn't
    getInstance: function () {
      if (!instance) {
        instance = init();
      }

      return instance;
    }
  };
}());

window.onload = tennisGame.getInstance();
