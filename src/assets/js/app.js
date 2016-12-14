(function () {
  'use strict';

  // Model controller
  var data = {
    mainCanva: document.getElementById('tennisCanvas'),

    score: {
      player1: 0,
      player2: 0,
      winner: 3
    },

    // Ball variables
    ball: {
      x: 50,
      y: 50,
      speed: {
        x: 5,
        y: 4
      }
    },

    // Paddle definition
    paddle: {
      size: 250,
      weight: 100,
      height: 10
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

    render: function (leftX, topY, width, height) {
      this.canvas.context.fillStyle = this.canvas.color;
      this.canvas.context.fillRect(leftX, topY, width, height);
    }
  };

  // Main controller
  var octopus = {
    init: function () {
      // this.setMyinterval();
      // this.view.canvas.el.addEventListener('mousemove', (e) => {
      //   console.log(e);
      // });

      view.render(0, 0, view.canvas.width, view.canvas.height, view.canvas.color);

      data.mainCanva.addEventListener('mousemove', (e) => {
        var curMousePos = this.calculateMousePos(e);
        data.paddle.size = curMousePos.y - (data.paddle.height / 2);
      });
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
    }
  };

  // App init
  octopus.init();
}());
