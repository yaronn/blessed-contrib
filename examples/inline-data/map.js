var blessed = require('blessed')
  , contrib = require('../../')
  , screen = blessed.screen()
  , map = contrib.map({
      label: 'World Map',
      markers: 
         [ {"lon" : "-79.0000", "lat" : "37.5000", color: "red", char: "X" }
         , {"lon" : "79.0000", "lat" : "37.5000", color: "blue", char: "O" }
         ]
   })
    
screen.append(map)

screen.render()