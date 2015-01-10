var blessed = require('blessed')
   , Node = blessed.Node
   , Box = blessed.Box
   , InnerCanvas = require('../../node-drawille-canvas').Canvas

function Canvas(options, canvasType) {  

  if (!(this instanceof Node)) {
    return new Canvas(options);
  }

  options = options || {};
  this.options = options
  Box.call(this, options);

  var innerCanvas = new InnerCanvas(options.canvas.width, options.canvas.height, canvasType)

  this._canvas = innerCanvas
  this.ctx = this._canvas.getContext()
}

Canvas.prototype.__proto__ = Box.prototype;

Canvas.prototype.type = 'canvas';

Canvas.prototype.clear = function() {
  this.ctx.clearRect(0, 0, this.options.canvas.width, this.options.canvas.width);
}

Canvas.prototype.render = function() {     

  this.clearPos(true);
  var inner = this.ctx._canvas.frame()  
  this.setContent(inner)
  return this._render();
};

module.exports = Canvas