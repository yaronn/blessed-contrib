var blessed = require('blessed')
   , Node = blessed.Node   
   , Canvas = require('./canvas')
   , InnerMap = require('../../canvas-map/map')

function Map(options) {  

  if (!(this instanceof Node)) {
    return new Map(options);
  }
    
  Canvas.call(this, options);

  this.ctx.strokeStyle="green"
  this.ctx.fillStyle="green"

  var opts = { excludeAntartica: true
              , disableBackground: true
              , disableMapBackground: true
              , disableGraticule: true
              , disableFill: true
              , labelSpace: 5
              , width: 150
              , height: 80
              , shapeColor: "green"}

  this.innerMap = new InnerMap(opts, this._canvas)  
  this.innerMap.draw()
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