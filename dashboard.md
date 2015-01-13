## Terminal Dashboards

A framework for building custom terminal dashboards using javascript.

## Contributors:

[@YaronNaveh](http://twitter.com/YaronNaveh)

<img src="./docs/images/term3.gif" />


## Running the sample

    git clone ...
    cd blessed-contrib
    node ./exampels/dashboard.js

(the sample source code is here)


## Installation (for a new project)

   npm install blessed
   npm install blessed-contrib


## Usage

See here a sample of a realtime dashboard with all supported widgets.

A simple dashboard:

`````javascript
   var blessed = require('blessed')
     , contrib = require('../index')
     , screen = blessed.screen()
     , grid = new contrib.grid({rows: 1, cols: 2})

   grid.set(0, 0, contrib.line, 
     { style: 
       { line: "yellow"
       , text: "green"
       , baseline: "black"}
     , xLabelPadding: 3
     , xPadding: 5
     , label: 'Stocks'})

   grid.set(0, 1, contrib.map, {label: 'Servers Location'})

   grid.applyLayout(screen)

   var line = grid.get(0, 0)
   var map = grid.get(0, 1)

   var lineData = {
      x: ['t1', 't2', 't3', 't4'],
      y: [5, 1, 7, 5]
   }

   line.setData(lineData.x, lineData.y)

   screen.key(['escape', 'q', 'C-c'], function(ch, key) {
     return process.exit(0);
   });

   screen.render()
`````

## More Information
[@YaronNaveh](http://twitter.com/YaronNaveh)
