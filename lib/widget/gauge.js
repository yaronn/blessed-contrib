var blessed = require('blessed')
   , Node = blessed.Node   
   , Canvas = require('./canvas')   

function Gauge(options) {  

  var self = this

  if (!(this instanceof Node)) {
    return new Gauge(options);
  }

  Canvas.call(this, options, require('ansi-term'));

  this.on("attach", function() {
    this.setPercent(0)
  })
  
}

Gauge.prototype.calcSize = function() {
    this.canvasSize = {width: this.width-2, height: this.height}
}

Gauge.prototype.__proto__ = Canvas.prototype;

Gauge.prototype.type = 'gauge';

Gauge.prototype.setPercent = function(percent) {           
    
    if (!this.ctx) {
      throw "error: canvas context does not exist. setData() for line charts must be called after the chart has been added to the screen via screen.append()"
    }

    var c = this.ctx    

    c.strokeStyle = 'magenta'
    c.fillStyle = 'white'

    c.clearRect(0, 0, this.canvasSize.width, this.canvasSize.height);        
    var width = percent/100*(this.canvasSize.width-3)
    c.fillRect(1, 2, width, 2)

    var textX = 7
    if (width<textX) {
      c.strokeStyle = 'normal'
    }

    c.fillText(percent+"%", textX, 3)
}


module.exports = Gauge