var blessed = require('blessed')
   , Node = blessed.Node   
   , Canvas = require('../canvas')   

function Bar(options) {  

  if (!(this instanceof Node)) {
    return new Bar(options);
  }

  Canvas.call(this, options, require('../../../ansi-term'));

  this.options.barWidth = this.options.barWidth || 6
  this.options.barSpacing = this.options.barSpacing || 9
  this.options.xOffset = this.options.xOffset || 5
  this.options.maxHeight = this.options.maxHeight || 7
  if (this.options.showText===false)
    this.options.showText = false
  else
    this.options.showText = true
}

Bar.prototype.calcSize = function() {
    this.canvasSize = {width: this.width-2, height: this.height}
}

Bar.prototype.setData = function(bar) {  
  
  this.clear()

  var c = this.ctx
    , max = Math.max.apply(Math, bar.data)
    , x = this.options.xOffset
    , y = this.options.maxHeight

  for (var i=0; i<bar.data.length; i++) {      
      var h = Math.round(this.options.maxHeight * (bar.data[i] / max));

      if (bar.data[i]>0) {  
        c.strokeStyle = 'blue'  
        c.fillRect(x, y - h + 3, this.options.barWidth, h);
      }
      else {
        c.strokeStyle = 'normal'
      }

      c.fillStyle = 'white'
      if (this.options.showText)
        c.fillText(bar.data[i] .toString(), x + 1, y + 2);
      c.strokeStyle = 'normal'
      c.fillStyle = 'white';
      if (this.options.showText)
        c.fillText(bar.titles[i] , x+1, y + 4);
      
      x += this.options.barSpacing;  
  }  
}

Bar.prototype.__proto__ = Canvas.prototype;

Bar.prototype.type = 'bar';

module.exports = Bar