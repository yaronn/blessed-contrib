
var blessed = require('blessed')
  , contrib = require('../../')
  , screen = blessed.screen()

var spark = contrib.sparkline(
     { label: 'Sparkline'
     , tags: true
     , border: {type: "line", fg: "cyan"} 
     , width: '50%'
     , height: '50%'
     , style: { fg: 'blue' }
     , data: { titles: [ 'Sparkline1', 'Sparkline2'], 
               data: [ [10, 20, 30, 20, 50, 70, 60, 30, 35, 38]
                     , [40, 10, 40, 50, 20, 30, 20, 20, 19, 40] ]
             }
      })

screen.append(spark)

screen.render()

