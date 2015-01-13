## blessed-contrib

Community widgets and samples for blessed

## Contributors:

[@YaronNaveh](http://twitter.com/YaronNaveh)

![term](./docs/images/term3.gif)

The dashboard sample [is here](dashboard.md)

## Installation

    npm install blessed-contrib


##Usage

the widgets in blessed-contrib follow the same pattern as in the blessed project:

`````javascript
   var blessed = require('blessed')
     , contrib = require('blessed-contrib')
     , screen = blessed.screen()
     , someWidget = contrib.someWidget({prop: value})

   screen.append(someWidget)

   //configure widget after append
   someWidget.setData({data: value})

   screen.key(['escape', 'q', 'C-c'], function(ch, key) {
     return process.exit(0);
   });

   screen.render()
`````

See bellow for a complete list of widgets.

You can also use a layout to position the widgets for you. See details in the dashboard sample.


## Widgets


### Line Chart

![line](./docs/images/line.gif)

`````javascript
   var line = contrib.line(
         { style: 
           { line: "yellow"
           , text: "green"
           , baseline: "black"}
         , xLabelPadding: 3
         , xPadding: 5
         , label: 'Title'})
   var data = {
         x: ['t1', 't2', 't3', 't4'],
         y: [5, 1, 7, 5]
      }
   screen.append(line) //must append before setting data
   line.setData(data.x, data.y)
`````


### Bar Chart

![bar](./docs/images/bar.gif)

`````javascript
var bar = contrib.bar(
   { label: 'Server Utilization (%)'
   , barWidth: 4
   , barSpacing: 6
   , xOffset: 0
   , maxHeight: 9})
screen.append(bar) //must append before setting data   
bar.setData({titles: ['bar1', 'bar2']], data: [5, 10]})
`````


### Map

![map](./docs/images/map.gif)

`````javascript
   var map = contrib.map({label: 'World Map'})
   map.addMarker({"lon" : "37.5000", "lat" : "-79.0000" })
`````


### Gauge

![gauge](./docs/images/gauge.gif)

`````javascript
   var gauge = contrib.gauge({label: 'Progress'})
   gauge.setPercent(25)
`````

### Rolling Log

![log](./docs/images/log.gif)

`````javascript
   var log = contrib.log(
      { fg: "green"
      , selectedFg: "green"
      , label: 'Server Log'})
   log.log("new log line")
`````


### Picture

![picture](./docs/images/picture.gif)

`````javascript
var pic = contrib.picture({file: './flower.png', cols: 25, onReady: ready})
function ready() {screen.render()}
`````

note: only png images are supported


### Sparkline

![spark](./docs/images/spark.gif)

`````javascript
   var spark = contrib.sparkline(
     { label: 'Throughput (bits/sec)'
     , tags: true
     , style: { fg: 'blue' }})

   sparkline.setData(['Sparkline1', 'Sparkline2'], [ [10, 20, 30, 20], [40, 10, 40, 50]])  
`````

### Table

![table](./docs/images/table.gif)

`````javascript
   var table = contrib.table(
     { keys: true
     , fg: 'green'
     , label: 'Active Processes'
     , columnSpacing: 16})

   //allow control the table with the keyboard
   table.focus()

   table.setData({headers: ['col1', col2'], data: [ [1, 2] , [3, 4] ]})
`````

### Layouts


### Grid

A grid layout can auto position your elements in a grid layout.
When using a grid, you should not create the widgets, rather specify to the grid which widget to create and with which params.

`````javascript
   var screen = blessed.screen()

   var grid = new contrib.grid({rows: 1, cols: 2})

   grid.set(0, 1, contrib.map, {label: 'World Map'})
   grid.set(0, 1, blessed.box, {content: 'My Box'})

   grid.applyLayout(screen)

   screen.render
`````

Grids can be nested:

`````javascript
   var grid = new contrib.grid({rows: 1, cols: 2})
   var grid1 = new contrib.grid({rows: 1, cols: 2})

   grid.set(0, 0, contrib.map, {label: 'World Map'})
   grid1.set(0, 0, blessed.box, {content: 'My Box'})
   grid1.set(0, 1, blessed.box, {content: 'My Box'})

   grid.set(0, 1, grid1)
`````


## Samples


### Terminal Dashboard

![term](./docs/images/term3.gif)

The dashboard details [are here](dashboard.md)

## More Information
[@YaronNaveh](http://twitter.com/YaronNaveh)
