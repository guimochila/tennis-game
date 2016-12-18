(function () {
  'use strict';

  // Model controller
  var data = {
    mainCanva: document.getElementById('tennisCanvas'),

    score: {
      player1: 0,
      player2: 0,
      total: 10,
      winner: false
    },

    // Ball variables
    ball: {
      x: 50,
      y: 50,
      speed: {
        x: 8,
        y: 4
      },
      color: 'white'
    },

    // Paddle definition
    paddle: {
      position: {
        p1: 250,
        p2: 250
      },
      weight: 10,
      height: 100
    }
  };

  // View controller
  var view = {
    canvas: {
      context: data.mainCanva.getContext('2d'),
      width: data.mainCanva.width,
      height: data.mainCanva.height,
      color: 'black'
    },

    // Render the score
    renderScore: function (score, playerId, label) {
      document.getElementById(label).classList.toggle('ahead');
      document.getElementById(playerId).textContent = score;
      setTimeout(function () {
        document.getElementById(label).classList.toggle('ahead');
      }, 2000);
    },

    renderObjs: {
      net: function () {
        var i;
        for (i = 0; i < view.canvas.height; i += 40) {
          view.render((view.canvas.width / 2) - 1, i, 2, 20, 'white');
        }
      },
      player1: function () {
        view.render(0, data.paddle.position.p1, data.paddle.weight, data.paddle.height, 'white');
      },
      player2: function () {
        view.render(view.canvas.width - data.paddle.weight, data.paddle.position.p2, data.paddle.weight, data.paddle.height, 'white');
      },
      ball: function (x, y, radius) {
        view.canvas.context.fillStyle = data.ball.color;
        view.canvas.context.beginPath();
        view.canvas.context.arc(x, y, radius, 0, Math.PI * 2, true);
        view.canvas.context.fill();
      }
    },

    render: function (leftX, topY, width, height, color) {
      this.canvas.context.fillStyle = color;
      this.canvas.context.fillRect(leftX, topY, width, height);
    }
  };

  // Main controller
  var octopus = {
    init: function () {
      data.mainCanva.addEventListener('mousemove', function (e) {
        var curMousePos = octopus.calculateMousePos(e);
        data.paddle.position.p1 = curMousePos.y - (data.paddle.height / 2);
      });

      setInterval(function () {
        octopus.move();
        view.render(0, 0, view.canvas.width, view.canvas.height, view.canvas.color);
        view.renderObjs.net();
        view.renderObjs.player1();
        view.renderObjs.player2();
        view.renderObjs.ball(data.ball.x, data.ball.y, 10);
      }, 1000 / 30);
    },

    // Calculate Mouse position
    calculateMousePos: function (e) {
      var rect = data.mainCanva.getBoundingClientRect();
      var rootEl = document.documentElement;
      var mouseX = e.clientX - rect.left - rootEl.scrollLeft;
      var mouseY = e.clientY - rect.top - rootEl.scrollTop;
      return {
        x: mouseX,
        y: mouseY
      };
    },

    // Ball reset
    ballReset: function () {
      if ((data.score.player1 >= data.score.total) || (data.score.player2 >= data.score.total)) {
        data.score.winner = true;
      }

      data.ball.speed.x = -data.ball.speed.x;
      data.ball.x = view.canvas.width / 2;
      data.ball.y = view.canvas.height / 2;
    },

    // Movement
    move: function () {
      // Computer Movement
      var paddle2Center = data.paddle.position.p2 + (data.paddle.height / 2);
      if (paddle2Center < data.ball.y - 35) {
        data.paddle.position.p2 += 6;
      } else if (paddle2Center > data.ball.y + 35) {
        data.paddle.position.p2 -= 6;
      }

      data.ball.x += data.ball.speed.x;
      data.ball.y += data.ball.speed.y;

      // Player 1
      if (data.ball.x < 0) {
        if (data.ball.y > data.paddle.position.p1 &&
          data.ball.y < data.paddle.position.p1 + data.paddle.height) {
          data.ball.speed.x = -data.ball.speed.x;
          data.ball.speed.y =
            (data.ball.y - (data.paddle.position.p1 + (data.paddle.height / 2))) * 0.35;
        } else {
          // player 2 score
          data.score.player2 += 1;
          view.renderScore(data.score.player2, 'p2Score', 'p2Name');
          this.ballReset();
        }
      }
      if (data.ball.x > view.canvas.width) {
        // Player 2
        if (data.ball.y > data.paddle.position.p2 &&
          data.ball.y < data.paddle.position.p2 + data.paddle.height) {
          data.ball.speed.x = -data.ball.speed.x;
          data.ball.speed.y =
            (data.ball.y - (data.paddle.position.p2 + (data.paddle.height / 2))) * 0.35;
        } else {
          // player 1 scores
          data.score.player1 += 1;
          view.renderScore(data.score.player1, 'p1Score', 'p1Name');
          this.ballReset();
        }
      }
      if (data.ball.y < 0) {
        data.ball.speed.y = -data.ball.speed.y;
      }
      if (data.ball.y > view.canvas.height) {
        data.ball.speed.y = -data.ball.speed.y;
      }
    }
  };
  // App init
  octopus.init();
}());
