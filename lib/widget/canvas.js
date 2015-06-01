var blessed = require('blessed')
   , Node = blessed.Node
   , Box = blessed.Box
   , InnerCanvas = require('drawille-canvas-blessed-contrib').Canvas

function Canvas(options, canvasType) {  

  var self = this

  if (!(this instanceof Node)) {
    return new Canvas(options);
  }

  options = options || {};
  this.options = options
  Box.call(this, options);

  this.on("attach", function() {
    self.calcSize()

    self._canvas = new InnerCanvas(this.canvasSize.width, this.canvasSize.height, canvasType)
    self.ctx = self._canvas.getContext()

    if (self.options.data) {
      self.setData(self.options.data)
    }
  })
}


Canvas.prototype.__proto__ = Box.prototype;

Canvas.prototype.type = 'canvas';

Canvas.prototype.calcSize = function() {
    this.canvasSize = {width: this.width*2-12, height: this.height*4}
}

Canvas.prototype.clear = function() {
  this.ctx.clearRect(0, 0, this.canvasSize.width, this.canvasSize.height);
}

Canvas.prototype.render = function() {     

  this.clearPos(true);
  var inner = this.ctx._canvas.frame()  
  this.setContent(inner)
  return this._render();
};

module.exports = Canvas