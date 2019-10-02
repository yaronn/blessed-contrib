'use strict';
var blessed = require('blessed')
  , Node = blessed.Node
  , Canvas = require('../canvas')
  , utils = require('../../utils.js')
  , _ = require('lodash');

function Line(options) {
  if (!(this instanceof Node)) {
    return new Line(options);
  }

  options.showNthLabel = options.showNthLabel || 1;
  options.style = options.style || {};
  options.style.line = options.style.line || 'yellow';
  options.style.text = options.style.text || 'green';
  options.style.baseline = options.style.baseline || 'black';
  options.xLabelPadding = options.xLabelPadding || 5;
  options.xPadding = options.xPadding || 10;
  options.numYLabels = options.numYLabels || 5;
  options.legend = options.legend || {};
  options.wholeNumbersOnly = options.wholeNumbersOnly || false;
  options.minY = options.minY || 0;

  Canvas.call(this, options);
}

Line.prototype = Object.create(Canvas.prototype);

Line.prototype.calcSize = function() {
  this.canvasSize = {width: this.width*2-12, height: this.height*4-8};
};

Line.prototype.type = 'line';

Line.prototype.setData = function(data) {

  if (!this.ctx) {
    throw 'error: canvas context does not exist. setData() for line charts must be called after the chart has been added to the screen via screen.append()';
  }

  //compatability with older api
  if (!Array.isArray(data)) data = [data];

  var self = this;
  var xLabelPadding = this.options.xLabelPadding;
  var yLabelPadding = 3;
  var xPadding = this.options.xPadding;
  var yPadding = 11;
  var c = this.ctx;
  var labels = data[0].x;

  function addLegend() {
    if (!self.options.showLegend) return;
    if (self.legend) self.remove(self.legend);
    var legendWidth = self.options.legend.width || 15;
    self.legend = blessed.box({
      height: data.length+2,
      top: 1,
      width: legendWidth,
      left: self.width-legendWidth-3,
      content: '',
      fg: 'green',
      tags: true,
      border: {
        type: 'line',
        fg: 'black'
      },
      style: {
        fg: 'blue',
      },
      screen: self.screen
    });

    var legandText = '';
    var maxChars = legendWidth-2;
    for (let i=0; i<data.length; i++) {
      var style = data[i].style || {};
      var color = utils.getColorCode(style.line || self.options.style.line);
      legandText += '{'+color+'-fg}'+ data[i].title.substring(0, maxChars)+'{/'+color+'-fg}\r\n';
    }
    self.legend.setContent(legandText);
    self.append(self.legend);
  }

  //iteratee for lodash _.max
  function getMaxY() {
    if (self.options.maxY) {
      return self.options.maxY;
    }

    var max = -Infinity;

    for(let i = 0; i < data.length; i++) {
      if (data[i].y.length) {
        var current = _.max(data[i].y, parseFloat);
        if (current > max) {
          max = current;
        }
      }
    }

    return max + (max - self.options.minY) * 0.2;
  }

  function formatYLabel(value, max, min, numLabels, wholeNumbersOnly, abbreviate) {
    var fixed = (((max - min) / numLabels) < 1 && value!=0 && !wholeNumbersOnly) ? 2 : 0;
    var res = value.toFixed(fixed);
    return abbreviate?utils.abbreviateNumber(res):res;
  }

  function getMaxXLabelPadding(numLabels, wholeNumbersOnly, abbreviate, min) {
    var max = getMaxY();

    return formatYLabel(max, max, min, numLabels, wholeNumbersOnly, abbreviate).length * 2;
  }

  var maxPadding = getMaxXLabelPadding(this.options.numYLabels, this.options.wholeNumbersOnly, this.options.abbreviate, this.options.minY);
  if (xLabelPadding < maxPadding) {
    xLabelPadding = maxPadding;
  }

  if ((xPadding - xLabelPadding) < 0) {
    xPadding = xLabelPadding;
  }

  function getMaxX() {
    var maxLength = 0;

    for(var i = 0; i < labels.length; i++) {
      if(labels[i] === undefined) {
        // console.log("label[" + i + "] is undefined");
      } else if(labels[i].length > maxLength) {
        maxLength = labels[i].length;
      }
    }

    return maxLength;
  }

  function getXPixel(val) {
    return ((self.canvasSize.width - xPadding) / labels.length) * val + (xPadding * 1.0) + 2;
  }

  function getYPixel(val, minY) {
    var res = self.canvasSize.height - yPadding - (((self.canvasSize.height - yPadding) / (getMaxY()-minY)) * (val-minY));
    res-=2; //to separate the baseline and the data line to separate chars so canvas will show separate colors
    return res;
  }

  // Draw the line graph
  function drawLine(values, style, minY) {
    style = style || {};
    var color = self.options.style.line;
    c.strokeStyle = style.line || color;

    c.moveTo(0, 0);
    c.beginPath();
    c.lineTo(getXPixel(0), getYPixel(values[0], minY));

    for(var k = 1; k < values.length; k++) {
      c.lineTo(getXPixel(k), getYPixel(values[k], minY));
    }

    c.stroke();
  }

  addLegend();

  c.fillStyle = this.options.style.text;

  c.clearRect(0, 0, this.canvasSize.width, this.canvasSize.height);


  var yLabelIncrement = (getMaxY()-this.options.minY)/this.options.numYLabels;
  if (this.options.wholeNumbersOnly) yLabelIncrement = Math.floor(yLabelIncrement);
  //if (getMaxY()>=10) {
  //  yLabelIncrement = yLabelIncrement + (10 - yLabelIncrement % 10)
  //}

  //yLabelIncrement = Math.max(yLabelIncrement, 1) // should not be zero

  if (yLabelIncrement==0) yLabelIncrement = 1;

  // Draw the Y value texts
  var maxY = getMaxY();
  for(var i = this.options.minY; i < maxY; i += yLabelIncrement) {
    c.fillText(formatYLabel(i, maxY, this.options.minY, this.options.numYLabels, this.options.wholeNumbersOnly, this.options.abbreviate), xPadding - xLabelPadding, getYPixel(i, this.options.minY));
  }

  for (var h=0; h<data.length; h++) {
    drawLine(data[h].y, data[h].style, this.options.minY);
  }


  c.strokeStyle = this.options.style.baseline;

  // Draw the axises
  c.beginPath();

  c.lineTo(xPadding, 0);
  c.lineTo(xPadding, this.canvasSize.height - yPadding);
  c.lineTo(this.canvasSize.width, this.canvasSize.height - yPadding);

  c.stroke();

  // Draw the X value texts
  var charsAvailable = (this.canvasSize.width - xPadding) / 2;
  var maxLabelsPossible = charsAvailable / (getMaxX() + 2);
  var pointsPerMaxLabel = Math.ceil(data[0].y.length / maxLabelsPossible);
  var showNthLabel = this.options.showNthLabel;
  if (showNthLabel < pointsPerMaxLabel) {
    showNthLabel = pointsPerMaxLabel;
  }

  for(let i = 0; i < labels.length; i += showNthLabel) {
    if((getXPixel(i) + (labels[i].length * 2)) <= this.canvasSize.width) {
      c.fillText(labels[i], getXPixel(i), this.canvasSize.height - yPadding + yLabelPadding);
    }
  }

};

Line.prototype.getOptionsPrototype = function() {
  return { width: 80
    , height: 30
    , left: 15
    , top: 12
    , xPadding: 5
    , label: 'Title'
    , showLegend: true
    , legend: {width: 12}
    , data: [ { title: 'us-east',
      x: ['t1', 't2', 't3', 't4'],
      y: [5, 1, 7, 5],
      style: {
        line: 'red'
      }
    }
    , { title: 'us-west',
      x: ['t1', 't2', 't3', 't4'],
      y: [2, 4, 9, 8],
      style: {line: 'yellow'}
    }
    , {title: 'eu-north-with-some-long-string',
      x: ['t1', 't2', 't3', 't4'],
      y: [22, 7, 12, 1],
      style: {line: 'blue'}
    }]

  };
};

module.exports = Line;
