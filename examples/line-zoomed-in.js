var blessed = require('blessed')
, contrib = require('../index')
, screen = blessed.screen()
, line = contrib.line(
   { width: 80
   , height: 30
   , left: 15
   , top: 12
   , xPadding: 5
   , minY: 1000
   , maxY: 1050
   , label: 'Title'
   , style: { baseline: 'white' }
   })

, data = [ { title: 'us-east',
             x: ['t1', 't2', 't3', 't4'],
             y: [1010, 1040, 1020, 1030],
             style: {
              line: 'red'
             }
           }
        ]


screen.append(line) //must append before setting data
line.setData(data)

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

screen.render()
