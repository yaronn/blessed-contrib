var blessed = require('blessed')
  , contrib = require('../')
  , screen = blessed.screen()
  , map = contrib.map({label: 'World Map'})
    
screen.append(map)

map.addMarker({"lon" : "-79.0000", "lat" : "37.5000", color: "red", char: "X" })

screen.render()