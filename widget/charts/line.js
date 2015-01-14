var blessed = require('blessed')
   , Node = blessed.Node   
   , Canvas = require('../canvas')
   , Chart = require('../../../chart.js/Chart.js')
   , utils = require('../../utils.js')

function Line(options) {  

  var self = this

  if (!(this instanceof Node)) {
    return new Line(options);
  }

  var chart_options = {
     responsive: false,
     animation: false,
     bezierCurve : false,
     scaleShowGridLines: false,
     scaleGridLineWidth: 0,
     showTooltips: false,     
     scaleBeginAtZero: true,
     showSmallBaseLines: false,     
     datasetFill: false,    
     scaleFontColor: "green",
     pointLabelFontColor: "green",
     scaleLineColor: "black",
     minSpaceBetweenXLabels: 1,
     xLabelSpacing: 6,
     yLabelSpacing: 8,
     XLineOffset: 1,
     scaleFontSize: 6,
     yLineOffset: 2     
  }

  options.chart_options = utils.MergeRecursive(options.chart_options, chart_options)
  
  Canvas.call(this, options);

  this.on("attach", function() {
    self.chart = new Chart(this.ctx)
  })
  
}

Line.prototype.calcSize = function() {
    this.canvasSize = {width: this.width*2-12, height: this.height*4-8}
}

Line.prototype.__proto__ = Canvas.prototype;

Line.prototype.type = 'line';

Line.prototype.setData = function(labels, data) {       
  var lineChartData = utils.MergeRecursive(this.options.chart_options.lineChartData, {labels: labels})
  lineChartData.datasets[0].data = data  
  this.chart.Line(lineChartData, this.options.chart_options)
}

module.exports = Line