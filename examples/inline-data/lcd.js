var blessed = require('blessed')
  , contrib = require('../../')
  , screen = blessed.screen()
  , grid = new contrib.grid({rows: 12, cols: 12, screen: screen})
  , map = grid.set(0, 0, 4, 4, contrib.map, {label: 'World Map'})
  , lcd = grid.set(4,4,4,4, contrib.lcd,
    {
      label: "LCD Test",
      segmentWidth: 0.06,
      segmentInterval: 0.11,
      strokeWidth: 0.1,
      elements: 5,
      display: 3210,
      elementSpacing: 4,
      elementPadding: 2
    })


screen.render()
  
