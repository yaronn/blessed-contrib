
var blessed = require('blessed')
  , contrib = require('../')
  , screen = blessed.screen()

var table = contrib.table(
   { keys: true
   , fg: 'green'
   , label: 'Active Processes'
   , width: '30%'
   , height: '30%'
   , border: {type: "line", fg: "cyan"}
   , columnSpacing: 10
   , columnWidth: [16, 12]})

table.focus()
screen.append(table)

table.setData(
 { headers: ['col1', 'col2']
 , data: 
  [ [1, 2] 
  , [3, 4] ]})

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

screen.render()




   

