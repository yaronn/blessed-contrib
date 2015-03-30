var blessed = require('blessed')
   , Node = blessed.Node   
   , Canvas = require('../canvas')
   , utils = require('../../utils.js')

function Line(options) {  

  var self = this

  if (!(this instanceof Node)) {
    return new Line(options);
  }
  
  options.showNthLabel = options.showNthLabel || 1
  options.style = options.style || {}  
  options.style.line = options.style.line || "yellow"
  options.style.text = options.style.text || "green"
  options.style.baseline = options.style.baseline || "black"
  options.xLabelPadding = options.xLabelPadding || 5
  options.xPadding = options.xPadding || 10

  Canvas.call(this, options);
  
}

Line.prototype.calcSize = function() {
    this.canvasSize = {width: this.width*2-12, height: this.height*4-8}
}

Line.prototype.__proto__ = Canvas.prototype;

Line.prototype.type = 'line';

Line.prototype.setData = function(labels, data) {           
    
    if (!this.ctx) {
      throw "error: canvas context does not exist. setData() for line charts must be called after the chart has been added to the screen via screen.append()"
    }

    var self = this
    var xLabelPadding = this.options.xLabelPadding
    var yLabelPadding = 2
    var xPadding = this.options.xPadding
    var yPadding = 10
    var c = this.ctx

    function getMaxY() {

      var max = 0;
      
      for(var i = 0; i < data.length; i ++) {
          if(data[i] > max) {
              max = data[i];
          }
      }
      
      //max += 25 - max % 25;
      max*=1.2
      max = Math.round(max);

      if (self.options.maxY) {
        return Math.max(max, self.options.maxY)
      }

      return max;
    }
    
    function getMaxXLabelPadding() {
      return getMaxY().toString().length * 2;
    }

    if (getMaxXLabelPadding() > xLabelPadding) {
      xLabelPadding = getMaxXLabelPadding();
    };

    if ((xPadding - xLabelPadding) < 0) {
      xPadding = xLabelPadding;
    }

    function getMaxX() {
      var maxLength = 0;
      
      for(var i = 0; i < labels.length; i++) {
        if(labels[i] === undefined) {
          console.log("label[" + i + "] is undefined");
        } else if(labels[i].length > maxLength) {
          maxLength = labels[i].length;
        }
      }
      
      return maxLength;
    }

    function getXPixel(val) {
        return ((self.canvasSize.width - xPadding) / data.length) * val + (xPadding * 1.0) + 2;
    }

    function getYPixel(val) {
        var res = self.canvasSize.height - yPadding - (((self.canvasSize.height - yPadding) / getMaxY()) * val);
        res-- //to separate the baseline and the data line to separate chars so canvas will show separate colors
        return res
    }


    c.strokeStyle = this.options.style.line
    c.fillStyle = this.options.style.text

    c.clearRect(0, 0, this.canvasSize.width, this.canvasSize.height);


    var yLabelIncrement = Math.round(getMaxY()/5)
    if (getMaxY()>=10) {
      yLabelIncrement = yLabelIncrement + (10 - yLabelIncrement % 10)
    }
    yLabelIncrement = Math.max(yLabelIncrement, 1) // should not be zero

    // Draw the Y value texts
    for(var i = 0; i < getMaxY(); i += yLabelIncrement) {    
        c.fillText(i.toString(), xPadding - xLabelPadding, getYPixel(i));    
    }

    // Draw the line graph
    c.beginPath();

    c.lineTo(getXPixel(0), getYPixel(data[0]));

    for(var i = 1; i < data.length; i ++) {
        c.lineTo(getXPixel(i), getYPixel(data[i]));    
    }

    c.stroke();

    c.strokeStyle = this.options.style.baseline

    // Draw the axises
    c.beginPath();

    c.lineTo(xPadding, 0);
    c.lineTo(xPadding, this.canvasSize.height - yPadding);
    c.lineTo(this.canvasSize.width, this.canvasSize.height - yPadding);

    c.stroke();

    // Draw the X value texts
    var charsAvailable = (this.canvasSize.width - xPadding) / 2;
    var maxLabelsPossible = charsAvailable / (getMaxX() + 2);
    var pointsPerMaxLabel = Math.round(data.length / (maxLabelsPossible));
    var showNthLabel = this.options.showNthLabel;
    if (showNthLabel < pointsPerMaxLabel) {
      showNthLabel = pointsPerMaxLabel;
    }

    for(var i = 0; i < data.length; i += showNthLabel) {                
      if((getXPixel(i) + (labels[i].length * 2)) <= this.canvasSize.width) {
        c.fillText(labels[i], getXPixel(i), this.canvasSize.height - yPadding + yLabelPadding);
      }
    }
}

module.exports = Line

