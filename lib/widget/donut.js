var blessed = require('blessed')
   , Node = blessed.Node
   , Canvas = require('./canvas');

function Donut(options) {

  var self = this

  options = options || {};
  self.options = options
  self.options.stroke = options.stroke || "magenta"
  self.options.fill = options.fill || "white"
  self.options.radius = options.radius || 14;
  self.options.arcWidth = options.arcWidth || 4;
  self.options.spacing = options.spacing || 2;
  self.options.yPadding = options.yPadding || 2;
  self.options.remainColor = options.remainColor || "black";
  self.options.data = options.data || [];

  if (!(this instanceof Node)) {
    return new Donut(options);
  }

  Canvas.call(this, options);

  this.on("attach", function() {
    this.setData(self.options.data);
  })
}

Donut.prototype.calcSize = function() {
    this.canvasSize = {width: Math.round(this.width*2-5), height: this.height*4-12}
    if (this.canvasSize.width % 2 == 1)
      this.canvasSize.width--;
    if (this.canvasSize.height % 4 != 1)
      this.canvasSize.height += (this.canvasSize.height % 4);
}

Donut.prototype.__proto__ = Canvas.prototype;

Donut.prototype.type = 'donut';

var cos = Math.cos;
var sin = Math.sin;
var pi = 3.141592635
Donut.prototype.setData = function(data){
  this.update(data);
}
Donut.prototype.update = function(data) {
    
    if (!this.ctx) {
      throw "error: canvas context does not exist. setData() for line charts must be called after the chart has been added to the screen via screen.append()"
    }

    var c = this.ctx
    c.save();
    c.translate(0,-this.options.yPadding);

    c.strokeStyle = this.options.stroke
    c.fillStyle = this.options.fill

    c.clearRect(0, 0, this.canvasSize.width, this.canvasSize.height);

    var cheight = this.canvasSize.height;
    var cwidth = this.canvasSize.width;

    function makeRound(percent, radius, width, cx, cy, color){
      var s = 0;
      var points = 370;
      c.strokeStyle = color || "green";
      while(s<radius){
        if (s < (radius - width)) {
          s++;
          continue;
        }
        var slice = 2 * pi / points
        c.beginPath();
        var p = parseFloat(percent*360);
        for(var i = 0;i<=points;i++){
          if (i>p) continue;
          var si = i-90;
          var a = slice * si;
          c.lineTo(Math.round(cx+s*cos(a)), Math.round(cy+s*sin(a)));
        }
        c.stroke();
        c.closePath();
        s++;
      }
    }

    var spacing = this.options.spacing;
    var donuts = data.length;
    var radius = this.options.radius;
    var width = this.options.arcWidth;
    var remainColor = this.options.remainColor;

    var middle = cheight / 2;
    var spacing = (cwidth - (donuts * radius * 2)) / (donuts + 1);

    if (data.length)
      makeDonuts(data);
    
    this.currentData = data;

    function makeDonuts(stats){
      for(var l = 0; l<=stats.length-1;l++){
        makeDonut(stats[l], l+1);
      }
    }

    function makeDonut(stat, which){
        var left = radius + (spacing * which) + (radius * 2 * (which - 1))
        var percent = stat.percent;
        if (percent > 1.001){
          percent = parseFloat(percent / 100).toFixed(2);
        }
        var label = stat.label;
        var color = stat.color || "green";
        var cxx = left;
        drawDonut(label, percent, radius, width, cxx, middle, color);
    }

    function drawDonut(label, percent, radius, width, cxx, middle, color){
      makeRound(100, radius, width, cxx, middle, remainColor );
      makeRound(percent, radius, width, cxx, middle, color);
      var ptext = parseFloat(percent*100).toFixed(0) + "%";
      c.fillText(ptext, cxx - Math.round(parseFloat((c.measureText(ptext).width)/2)) + 3, middle);
      c.fillText(label, cxx - Math.round(parseFloat((c.measureText(label).width)/2)) + 3, (middle + radius) + 5);
    }

    c.strokeStyle = "magenta";

    c.restore();
    return;
}

Donut.prototype.getOptionsPrototype = function() {
  return {
              spacing: 1,
              yPadding: 1,
              radius: 1,
              arcWidth: 1,
              data: [ { color: 'red', percent: '50', label: 'a'}
                    , { color: 'blue', percent: '20', label: 'b'}
                    , { color: 'yellow', percent: '80', label: 'c'}
              ]
         }
}

module.exports = Donut
