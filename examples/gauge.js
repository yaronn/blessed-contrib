var blessed = require('blessed')
  , contrib = require('../')
  , screen = blessed.screen()
  , gauge = contrib.gauge({label: 'Progress'})
    
screen.append(gauge)

gauge.setPercent(25)

screen.render()