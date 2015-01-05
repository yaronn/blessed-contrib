var blessed = require('blessed')
   , Node = blessed.Node   
   , Canvas = require('../canvas')
   , Chart = require('../../../chart.js/Chart.js')

function Line(options) {  

  if (!(this instanceof Node)) {
    return new Line(options);
  }

  Canvas.call(this, options);

  this.chart = new Chart(this.ctx)
}

Line.prototype.__proto__ = Canvas.prototype;

Line.prototype.type = 'line';

Line.prototype.setData = function(data) {     
  this.chart.Line(data, this.options.chart_options)
}

module.exports = Line