'use strict';
var blessed = require('blessed')
  , Node = blessed.Node
  , Canvas = require('./canvas');

function Gauge(options) {
  if (!(this instanceof Node)) {
    return new Gauge(options);
  }

  var self = this;

  options = options || {};
  self.options = options;
  self.options.stroke = options.stroke || 'magenta';
  self.options.fill = options.fill || 'white';
  self.options.data = options.data || [];
  self.options.showLabel = options.showLabel !== false;

  Canvas.call(this, options, require('ansi-term'));

  this.on('attach', function() {
    if (self.options.stack) {
      var stack = this.stack = self.options.stack;
      this.setStack(stack);
    } else {
      var percent = this.percent = self.options.percent || 0;
      this.setData(percent);
    }
  });
}

Gauge.prototype = Object.create(Canvas.prototype);

Gauge.prototype.calcSize = function() {
  this.canvasSize = {width: this.width-2, height: this.height};
};

Gauge.prototype.type = 'gauge';

Gauge.prototype.setData = function(data){
  if (typeof(data) == typeof([]) && data.length > 0){
    this.setStack(data);
  } else if(typeof(data) == typeof(1)) {
    this.setPercent(data);
  }
};

Gauge.prototype.setPercent = function(percent) {

  if (!this.ctx) {
    throw 'error: canvas context does not exist. setData() for gauges must be called after the gauge has been added to the screen via screen.append()';
  }

  var c = this.ctx;

  c.strokeStyle = this.options.stroke;//'magenta'
  c.fillStyle = this.options.fill;//'white'

  c.clearRect(0, 0, this.canvasSize.width, this.canvasSize.height);
  if (percent < 1.001){
    percent = percent * 100;
  }
  var width = percent/100*(this.canvasSize.width-3);
  c.fillRect(1, 2, width, 2);

  var textX = 7;
  if (width<textX) {
    c.strokeStyle = 'normal';
  }

  if (this.options.showLabel) c.fillText(Math.round(percent)+'%', textX, 3);
};

Gauge.prototype.setStack = function(stack) {
  var colors = ['green','magenta','cyan','red','blue'];

  if (!this.ctx) {
    throw 'error: canvas context does not exist. setData() for gauges must be called after the gauge has been added to the screen via screen.append()';
  }

  var c = this.ctx;
  var leftStart = 1;
  var textLeft = 5;
  c.clearRect(0, 0, this.canvasSize.width, this.canvasSize.height);

  for (var i = 0; i < stack.length; i++) {
    var currentStack = stack[i];

    let percent;
    if (typeof(currentStack) == typeof({}))
      percent = currentStack.percent;
    else
      percent = currentStack;

    c.strokeStyle = currentStack.stroke || colors[(i%colors.length)]; // use specified or choose from the array of colors
    c.fillStyle = this.options.fill;//'white'

    textLeft = 5;
    if (percent < 1.001){
      percent = percent * 100;
    }
    var width = percent/100*(this.canvasSize.width-3);

    c.fillRect(leftStart, 2, width, 2);

    textLeft = (width / 2) - 1;
    // if (textLeft)
    var textX = leftStart+textLeft;

    if ((leftStart+width)<textX) {
      c.strokeStyle = 'normal';
    }
    if (this.options.showLabel) c.fillText(percent+'%', textX, 3);

    leftStart += width;
  }
};

Gauge.prototype.getOptionsPrototype = function() {
  return {percent: 10};
};


module.exports = Gauge;
