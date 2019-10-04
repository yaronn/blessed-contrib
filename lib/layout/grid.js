'use strict';
var utils = require('../utils');

var widgetSpacing = 0;

function Grid(options) {
  if (!options.screen) throw 'Error: A screen property must be specified in the grid options.\r\n' +
                              'Note: Release 2.0.0 has breaking changes. Please refer to the README or to https://github.com/yaronn/blessed-contrib/issues/39';
  this.options = options;
  this.options.dashboardMargin = this.options.dashboardMargin || 0;
  this.cellWidth = ((100 - this.options.dashboardMargin*2) / this.options.cols);
  this.cellHeight = ((100  - this.options.dashboardMargin*2) / this.options.rows);
}

Grid.prototype.set = function(row, col, rowSpan, colSpan, obj, opts) {

  if (obj instanceof Grid) {
    throw 'Error: A Grid is not allowed to be nested inside another grid.\r\n' +
            'Note: Release 2.0.0 has breaking changes. Please refer to the README or to https://github.com/yaronn/blessed-contrib/issues/39';
  }

  var top = row * this.cellHeight + this.options.dashboardMargin;
  var left = col * this.cellWidth + this.options.dashboardMargin;

  //var options = JSON.parse(JSON.stringify(opts));
  var options = {};
  options = utils.MergeRecursive(options, opts);
  options.top = top + '%';
  options.left = left + '%';
  options.width = (this.cellWidth * colSpan - widgetSpacing) + '%';
  options.height = (this.cellHeight * rowSpan - widgetSpacing) + '%';
  if (!this.options.hideBorder)
    options.border = {type: 'line', fg: this.options.color || 'cyan'};

  var instance = obj(options);
  this.options.screen.append(instance);
  return instance;
};

module.exports = Grid;
