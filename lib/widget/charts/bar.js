var blessed = require('blessed')
   , Node = blessed.Node
   , Canvas = require('../canvas')

function Bar(options) {
  
  var self = this

  if (!(this instanceof Node)) {
    return new Bar(options);
  }

  Canvas.call(this, options, require('ansi-term'));

  this.options.barWidth = this.options.barWidth || 6
  this.options.barSpacing = this.options.barSpacing || 9

  if ((this.options.barSpacing - this.options.barWidth) < 3) {
    this.options.barSpacing = this.options.barWidth + 3;
  }

  this.options.xOffset = this.options.xOffset==null? 5 : this.options.xOffset
  if (this.options.showText === false)
    this.options.showText = false
  else
    this.options.showText = true

  this.on("attach", function() {
    if (self.options.data) {
      self.setData(self.options.data)
    }
  })
}

Bar.prototype.calcSize = function() {
    this.canvasSize = {width: this.width-2, height: this.height}
}

Bar.prototype.setData = function(bar) {
  
   if (!this.ctx) {
      throw "error: canvas context does not exist. setData() for bar charts must be called after the chart has been added to the screen via screen.append()"
   }

  this.clear()

  var c = this.ctx;
  var max = Math.max.apply(Math, bar.data);
  max = Math.max(max, this.options.maxHeight)
  var x = this.options.xOffset;
  var barY = this.canvasSize.height - 5;

  for (var i = 0; i < bar.data.length; i++) {
    var h = Math.round(barY * (bar.data[i] / max));

    if (bar.data[i] > 0) {
      c.strokeStyle = 'blue'
      if (this.options.barBgColor)
        c.strokeStyle = this.options.barBgColor;
      c.fillRect(x, barY - h + 1, this.options.barWidth, h);
    } else {
      c.strokeStyle = 'normal'
    }

    c.fillStyle = 'white'
    if (this.options.barFgColor)
      c.fillStyle = this.options.barFgColor;
    if (this.options.showText)
      c.fillText(bar.data[i].toString(), x + 1, this.canvasSize.height - 4);
    c.strokeStyle = 'normal'
    c.fillStyle = 'white';
    if (this.options.labelColor)
      c.fillStyle = this.options.labelColor;
    if (this.options.showText)
      c.fillText(bar.titles[i], x + 1, this.canvasSize.height - 3);

    x += this.options.barSpacing;
  }
}

Bar.prototype.getOptionsPrototype = function() {
    return  {  barWidth: 1
            ,  barSpacing: 1
            ,  xOffset: 1
            ,  maxHeight: 1
            ,  data: { titles: ['s']
                     , data: [1]}
            }
}


Bar.prototype.__proto__ = Canvas.prototype;

Bar.prototype.type = 'bar';

module.exports = Bar
