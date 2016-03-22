var blessed = require('blessed')
   , Node = blessed.Node
   , Canvas = require('../canvas')
   , utils = require('../../utils.js')

function StackedBar(options) {

  var self = this

  if (!(this instanceof Node)) {
    return new StackedBar(options);
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

  this.options.legend = this.options.legend || {}
  if (this.options.showLegend === false)
    this.options.showLegend = false
  else
    this.options.showLegend = true

  this.on("attach", function() {
    if (self.options.data) {
      self.setData(self.options.data)
    }
  })
}

StackedBar.prototype.calcSize = function() {
  this.canvasSize = {width: this.width-2, height: this.height}
}

StackedBar.prototype.getSummedBars = function(bars) {
  var res = []
  bars.forEach(function(stackedValues) {
    var sum = stackedValues.reduce(function(a,b) { return a + b } , 0)
    res.push(sum)
  })
  return res
}

StackedBar.prototype.setData = function(bars) {

   if (!this.ctx) {
      throw "error: canvas context does not exist. setData() for bar charts must be called after the chart has been added to the screen via screen.append()"
   }

  this.clear()

  var summedBars = this.getSummedBars(bars.data)
  var maxBarValue = Math.max.apply(Math, summedBars)
  if (this.options.maxValue)
      maxBarValue = Math.max(maxBarValue, this.options.maxValue)
  var x = this.options.xOffset;
  for (var i = 0; i < bars.data.length; i++) {
    this.renderBar(x, bars.data[i], summedBars[i], maxBarValue, bars.barCategory[i])
    x += this.options.barSpacing;
  }

  this.addLegend(bars, x)
}

StackedBar.prototype.renderBar = function(x, bar, curBarSummedValue, maxBarValue, category) {
/*
  var c = this.ctx
  c.strokeStyle = 'red';
  c.fillRect(0,7,4,0)
  c.strokeStyle = 'blue';
  c.fillRect(0,4,4,1)
  c.strokeStyle = 'green';
  c.fillRect(5,7,4,2)
  return
*/

  var c = this.ctx
  c.strokeStyle = 'normal'
  c.fillStyle = 'white';
  if (this.options.labelColor)
    c.fillStyle = this.options.labelColor;
  if (this.options.showText) {
    c.fillText(category, x + 1, this.canvasSize.height-1);
  }

  if (curBarSummedValue < 0) return
  //first line is for label
  BUFFER_FROM_TOP = 2
  BUFFER_FROM_BOTTOM = 1
  var maxBarHeight = this.canvasSize.height - BUFFER_FROM_TOP - BUFFER_FROM_BOTTOM
  var currentBarHeight = Math.round(maxBarHeight * (curBarSummedValue / maxBarValue))
  //start painting from bottom of bar, section by section
  var y = maxBarHeight + BUFFER_FROM_TOP
  var availableBarHeight = currentBarHeight
  for (var i=0; i < bar.length; i++) {
    var currStackHeight = this.renderBarSection(
      x,
      y,
      bar[i],
      curBarSummedValue,
      currentBarHeight,
      availableBarHeight,
      this.options.barBgColor[i])
    y -= currStackHeight
    availableBarHeight -= currStackHeight
  }
}

StackedBar.prototype.renderBarSection = function(
  x,
  y,
  data,
  curBarSummedValue,
  currentBarHeight,
  availableBarHeight,
  bg) {
  var c = this.ctx

  var currStackHeight = currentBarHeight <= 0?
    0 :
    Math.min(
      availableBarHeight, //round() can make total stacks excceed curr bar height so we limit it
      Math.round(currentBarHeight * (data / curBarSummedValue))
    )
  c.strokeStyle = bg;

  if (currStackHeight>0) {
    var calcY = y - currStackHeight
    /*fillRect starts from the point bottom of start point so we compensate*/
    var calcHeight = Math.max(0, currStackHeight-1)
    c.fillRect(
      x,
      calcY,
      this.options.barWidth,
      calcHeight
    )

    c.fillStyle = 'white'
    if (this.options.barFgColor)
      c.fillStyle = this.options.barFgColor;
    if (this.options.showText) {
      var str = utils.abbreviateNumber(data.toString())
      c.fillText(
        str,
        Math.floor(x + this.options.barWidth/2 + str.length/2),
        calcY + Math.round(calcHeight/2));
    }
  }

  return currStackHeight
}

StackedBar.prototype.getOptionsPrototype = function() {
    return  {  barWidth: 1
            ,  barSpacing: 1
            ,  xOffset: 1
            ,  maxValue: 1
            ,  barBgColor: 's'
            ,  data: { barCategory: ['s']
                     , stackedCategory: ['s']
                     , data: [ [ 1] ]
                     }
            }
}



StackedBar.prototype.addLegend = function(bars, x) {
      var self = this
      if (!self.options.showLegend) return
      if (self.legend) self.remove(self.legend)
      var legendWidth = self.options.legend.width || 15
      self.legend = blessed.box({
            height: bars.stackedCategory.length+2,
            top: 1,
            width: legendWidth,
            left: x,
            content: '',
            fg: "green",
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

      var legandText = ""
      var maxChars = legendWidth-2
      for (var i=0; i<bars.stackedCategory.length; i++) {
        var color = utils.getColorCode(self.options.barBgColor[i])
        legandText += '{'+color+'-fg}'+ bars.stackedCategory[i].substring(0, maxChars)+'{/'+color+'-fg}\r\n'
      }
      self.legend.setContent(legandText)
      self.append(self.legend)
}


StackedBar.prototype.__proto__ = Canvas.prototype;

StackedBar.prototype.type = 'bar';

module.exports = StackedBar
