'use strict';
var blessed = require('blessed')
  , Node = blessed.Node
  , Canvas = require('./canvas')
  , InnerMap = require('map-canvas');

function Map(options) {
  var self = this;

  if (!(this instanceof Node)) {
    return new Map(options);
  }

  Canvas.call(this, options);

  this.on('attach', function() {

    options.style = options.style || {};

    var opts = { excludeAntartica: (options.excludeAntarctica === undefined) ? true : options.excludeAntarctica
      , disableBackground: (options.disableBackground === undefined) ? true : options.disableBackground
      , disableMapBackground: (options.disableMapBackground === undefined) ? true : options.disableMapBackground
      , disableGraticule: (options.disableGraticule === undefined) ? true : options.disableGraticule
      , disableFill: (options.disableFill === undefined) ? true : options.disableFill
      , width: self.ctx._canvas.width
      , height: self.ctx._canvas.height
      , shapeColor: options.style.shapeColor || 'green'};

    opts.startLon = options.startLon || undefined;
    opts.endLon = options.endLon || undefined;
    opts.startLat = options.startLat || undefined;
    opts.endLat = options.endLat || undefined;
    opts.region = options.region || undefined;
    opts.labelSpace = options.labelSpace || 5;

    this.ctx.strokeStyle= options.style.stroke || 'green';
    this.ctx.fillStyle=options.style.fill || 'green';

    self.innerMap = new InnerMap(opts, this._canvas);
    self.innerMap.draw();

    if (self.options.markers) {

      for (var m in self.options.markers) {
        self.addMarker(self.options.markers[m]);
      }
    }
  });

}

Map.prototype = Object.create(Canvas.prototype);

Map.prototype.calcSize = function() {
  this.canvasSize = {width: this.width*2-12, height: this.height*4};
};

Map.prototype.type = 'map';

Map.prototype.addMarker = function(options) {
  if (!this.innerMap) {
    throw 'error: canvas context does not exist. addMarker() for maps must be called after the map has been added to the screen via screen.append()';
  }

  this.innerMap.addMarker(options);
};

Map.prototype.getOptionsPrototype = function() {

  return { startLon: 10
    , endLon: 10
    , startLat: 10
    , endLat: 10
    , region: 'us'
    , markers:
             [  {'lon' : '-79.0000', 'lat' : '37.5000', color: 'red', char: 'X' }
               ,{'lon' : '79.0000', 'lat' : '37.5000', color: 'blue', char: 'O' }
             ]
  };
};

Map.prototype.clearMarkers = function() {
  this.innerMap.draw();
};

module.exports = Map;
