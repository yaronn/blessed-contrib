var blessed = require('blessed')
  , contrib = require('../')
  , screen = blessed.screen()
  , grid = new contrib.grid({rows: 2, cols: 2, hideBorder: true, screen: screen})
  , gaugeList = grid.set(0, 0, 1, 2, contrib.gaugeList,
      {
        gaugeSpacing: 0,
        gaugeHeight: 1,
        gauges:
          [ {showLabel: false, stack: [{percent: 30, stroke: 'green'}, {percent: 30, stroke: 'magenta'}, {percent: 40, stroke: 'cyan'}] }
          , {showLabel: false, stack: [{percent: 40, stroke: 'yellow'}, {percent: 20, stroke: 'magenta'}, {percent: 40, stroke: 'green'}] }
          , {showLabel: false, stack: [{percent: 50, stroke: 'red'}, {percent: 10, stroke: 'magenta'}, {percent: 40, stroke: 'cyan'}] } ]
      }
    )

screen.render()



screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

