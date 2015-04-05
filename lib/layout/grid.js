var utils = require('../utils')

var dashboardMargin = 0
var widgetSpacing = 0

function Grid(options) {
   if (!options.screen) throw "error: a screen property must be specified in the grid options"
   this.options = options
   this.cellWidth = ((100 - dashboardMargin*2) / this.options.cols)
   this.cellHeight = ((100  - dashboardMargin*2) / this.options.rows)
}

Grid.prototype.set = function(row, col, rowSpan, colSpan, obj, opts) {
   var top = row * this.cellHeight + dashboardMargin
   var left = col * this.cellWidth + dashboardMargin

   var options = JSON.parse(JSON.stringify(opts));
   options.top = top + '%'
   options.left = left + '%'
   options.width = (this.cellWidth * colSpan - widgetSpacing) + "%"
   options.height = (this.cellHeight * rowSpan - widgetSpacing) + "%"
   options.border = {type: "line", fg: "cyan"}         
   
   var instance = obj(options)
   this.options.screen.append(instance)
   return instance
}
   
module.exports = Grid