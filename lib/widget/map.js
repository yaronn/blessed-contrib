var blessed = require('blessed')
   , Node = blessed.Node   
   , Canvas = require('./canvas')
   , InnerMap = require('map-canvas')

function Map(options) {  

  var self = this

  if (!(this instanceof Node)) {
    return new Map(options);
  }
    
  Canvas.call(this, options);
    
  this.on("attach", function() {
    var opts = { excludeAntartica: true
              , disableBackground: true
              , disableMapBackground: true
              , disableGraticule: true
              , disableFill: true
              , labelSpace: 5
              , width: self.ctx._canvas.width
              , height: self.ctx._canvas.height
              , shapeColor: "green"}

    this.ctx.strokeStyle="green"
    this.ctx.fillStyle="green"

    self.innerMap = new InnerMap(opts, this._canvas)  
    self.innerMap.draw()
  })
  
}

Map.prototype.calcSize = function() {
    this.canvasSize = {width: this.width*2-12, height: this.height*4-12}
}

Map.prototype.__proto__ = Canvas.prototype;

Map.prototype.type = 'map';

Map.prototype.addMarker = function(options) {
   if (!this.innerMap) {
     throw "error: canvas context does not exist. addMarker() for maps must be called after the map has been added to the screen via screen.append()"
   }

   this.innerMap.addMarker(options)   
}

Map.prototype.clearMarkers = function() {
  this.innerMap.draw()
}

module.exports = Map