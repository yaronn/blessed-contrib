var blessed = require('blessed')
  , contrib = require('../../')
  , screen = blessed.screen()
  , bar = contrib.bar(
       { label: 'Server Utilization (%)'
       , barWidth: 4
       , barSpacing: 6
       , xOffset: 0
       , maxHeight: 9
       , height: "40%"
       , data: { titles: ['bar1', 'bar2']
               , data: [5, 10]}
               })

screen.append(bar)

screen.render()