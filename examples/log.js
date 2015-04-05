var blessed = require('blessed')
  , contrib = require('../')
  , screen = blessed.screen()
  , log = contrib.log(
      { fg: "green"
      , selectedFg: "green"
      , label: 'Server Log'
      , height: "20%"
      , border: {type: "line", fg: "cyan"} })
    
screen.append(log)

var i = 0
setInterval(function() {log.log("new log line " + i++)}, 500)

screen.render()
