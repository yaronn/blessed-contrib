var blessed = require('blessed')
  , contrib = require('../')
  , screen = blessed.screen()
  , grid = new contrib.grid({rows: 2, cols: 2, hideBorder: true, screen: screen})
  , gauge1 = grid.set(0, 0, 1, 1, contrib.gauge, {showLabel: false, stack: [{percent: 30, stroke: 'green'}, {percent: 30, stroke: 'magenta'}, {percent: 40, stroke: 'cyan'}] })

screen.render()
