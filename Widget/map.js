var blessed = require('blessed')
   , Node = blessed.Node   
   , Canvas = require('./canvas')
   , InnerMap = require('../../canvas-map/map')

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
    this.canvasSize = {width: this.width*2-12, height: this.height*4-8}
}

Map.prototype.__proto__ = Canvas.prototype;

Map.prototype.type = 'map';

Map.prototype.addMarker = function(coord, markerType) {     
   this.innerMap.addMarker(coord, markerType)   
}

Map.prototype.clearMarkers = function() {
  this.innerMap.draw()
}

module.exports = Map