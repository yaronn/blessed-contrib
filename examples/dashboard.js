var blessed = require('blessed')
var contrib = require('blessed-contrib')

var grid = new contrib.Layout.Grid({rows: 1, cols: 2})
grid.set(0, 0, contrib.Charts.Line, {title: 'vusers', showGrid: false})
grid.set(0, 1, contrib.Charts.Line, {title: 'hits', showGrid: false})

var screen = blessed.screen({width: '50%', height: '50%'})
grid.applyLayout(screen)
screen.render()

var vusers = grid.get(0, 0)
var hits = grid.get(0, 1)

setInterval(function() {
   vusers.setData({'5', 6})
   hits.setData({'5', 6})
   screen.render()
}, 500)