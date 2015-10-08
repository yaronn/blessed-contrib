var blessed = require('blessed')
  , contrib = require('../')
  , screen = blessed.screen()
  , log = contrib.log(
      { fg: "green"
      , label: 'Server Log'      
      , height: "20%"
      , tags: true      
      , border: {type: "line", fg: "cyan"} })
    
screen.append(log)

var i = 0
setInterval(function() {log.log("new {red-fg}log{/red-fg} line " + i++)}, 500)

screen.render()
