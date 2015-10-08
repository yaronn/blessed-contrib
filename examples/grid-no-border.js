
var blessed = require('blessed')
  , contrib = require('../')
  , screen = blessed.screen()
  , grid = new contrib.grid({rows: 12, cols: 12, hideBorder: true, screen: screen})
  , map = grid.set(0, 0, 4, 4, contrib.map, {})
  , box = grid.set(4, 4, 4, 4, blessed.box, {content: 'My Box'})

screen.render()
