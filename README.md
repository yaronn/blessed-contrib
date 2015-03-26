## blessed-contrib

Build dashboards (or any other application) using ascii/ansi art and javascript.

Friendly to terminals, ssh and developers. Extends [blessed](https://github.com/chjj/blessed) with custom  [drawille](https://github.com/madbence/node-drawille) and other widgets.


**Contributors:**

Yaron Naveh ([@YaronNaveh](http://twitter.com/YaronNaveh))

**Demo ([full size](https://raw.githubusercontent.com/yaronn/blessed-contrib/master/docs/images/term3.gif)):**

<img src="./docs/images/term3.gif" alt="term" width="800">

([source code](./examples/dashboard.js))

**Running the demo**

    git clone https://github.com/yaronn/blessed-contrib.git
    cd blessed-contrib
    npm install
    node ./examples/dashboard.js

Tested on Linux and OS X. In order to use on windows need to install Braille fonts (not tested).

## Installation (to build custom projects)

    npm install blessed blessed-contrib    

##Usage

You can use any of the default widgets of [blessed](https://github.com/chjj/blessed) (texts, lists and etc) or the widgets added in blessed-contrib (described bellow). The widgets in blessed-contrib follow the same usage pattern:

`````javascript
   var blessed = require('blessed')
     , contrib = require('blessed-contrib')
     , screen = blessed.screen()
     , line = contrib.line(
         { style: 
           { line: "yellow"
           , text: "green"
           , baseline: "black"}
         , xLabelPadding: 3
         , xPadding: 5
         , label: 'Title'})
     , data = {
         x: ['t1', 't2', 't3', 't4'],
         y: [5, 1, 7, 5]
      }
   screen.append(line) //must append before setting data
   line.setData(data.x, data.y)
   
   screen.key(['escape', 'q', 'C-c'], function(ch, key) {
     return process.exit(0);
   });

   screen.render()
`````

See bellow for a complete list of widgets.

You can also use a layout to position the widgets for you (details in the layouts section).


## Widgets


### Line Chart

<img src="./docs/images/line.gif" alt="line" width="400">

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

<img src="./docs/images/bar.gif" alt="bar" width="250">

`````javascript
    var bar = contrib.bar(
       { label: 'Server Utilization (%)'
       , barWidth: 4
       , barSpacing: 6
       , xOffset: 0
       , maxHeight: 9})
    screen.append(bar) //must append before setting data   
    bar.setData(
       { titles: ['bar1', 'bar2']
       , data: [5, 10]})
`````


### Map

<img src="./docs/images/map.gif" alt="map" width="500">

`````javascript
   var map = contrib.map({label: 'World Map'})
   map.addMarker({"lon" : "-79.0000", "lat" : "37.5000", color: "red", char: "X" })
`````


### Gauge

<img src="./docs/images/gauge.gif" alt="gauge" width="170">

`````javascript
   var gauge = contrib.gauge({label: 'Progress'})
   gauge.setPercent(25)
`````

### Rolling Log

<img src="./docs/images/log.gif" alt="log" width="180">

`````javascript
   var log = contrib.log(
      { fg: "green"
      , selectedFg: "green"
      , label: 'Server Log'})
   log.log("new log line")
`````


### Picture

`````javascript
    var pic = contrib.picture(
       { file: './flower.png'
       , cols: 25
       , onReady: ready})
    function ready() {screen.render()}
`````

note: only png images are supported


### Sparkline

<img src="./docs/images/spark.gif" alt="spark" width="180">

`````javascript
   var spark = contrib.sparkline(
     { label: 'Throughput (bits/sec)'
     , tags: true
     , style: { fg: 'blue' }})

   sparkline.setData(
   [ 'Sparkline1', 'Sparkline2'], 
   [ [10, 20, 30, 20]
   , [40, 10, 40, 50]])
`````

### Table

<img src="./docs/images/table.gif" alt="table" width="250">

`````javascript
   var table = contrib.table(
     { keys: true
     , fg: 'green'
     , label: 'Active Processes'
     , columnSpacing: [16, 12, 12] /*or just 16*/})

   //allow control the table with the keyboard
   table.focus()

   table.setData(
   { headers: ['col1', 'col2']
   , data: 
      [ [1, 2] 
      , [3, 4] ]})
`````

### Layouts


### Grid

A grid layout can auto position your elements in a grid layout.
When using a grid, you should not create the widgets, rather specify to the grid which widget to create and with which params.

`````javascript
   var screen = blessed.screen()

   var grid = new contrib.grid({rows: 1, cols: 2})

   //grid.set(row, col, rowSpan, colSpan, obj, opts)
   grid.set(0, 1, 1, 1, contrib.map, {label: 'World Map'})
   grid.set(0, 1, 1, 1, blessed.box, {content: 'My Box'})

   grid.applyLayout(screen)

   screen.render
`````

Grids can be nested:

`````javascript
   var grid = new contrib.grid({rows: 1, cols: 2})
   var grid1 = new contrib.grid({rows: 1, cols: 2})

   grid.set(0, 0, 1, 1, contrib.map, {label: 'World Map'})
   grid1.set(0, 0, 1, 1, blessed.box, {content: 'My Box'})
   grid1.set(0, 1, 1, 1, blessed.box, {content: 'My Box'})

   grid.set(0, 1, 1, 1, grid1)
`````


## Samples


### Terminal Dashboard

<img src="./docs/images/term3.gif" alt="term" width="800">

**Running the sample**

    git clone https://github.com/yaronn/blessed-contrib.git
    cd blessed-contrib
    npm install
    node ./examples/dashboard.js

**Installation (for a custom dashbaord)**

    npm install blessed
    npm install blessed-contrib


**A simple dashboard**

`````javascript
   var blessed = require('blessed')
     , contrib = require('blessed-contrib')
     , screen = blessed.screen()
     , grid = new contrib.grid({rows: 1, cols: 2})

   grid.set(0, 0, 1, 1, contrib.line, 
     { style: 
       { line: "yellow"
       , text: "green"
       , baseline: "black"}
     , xLabelPadding: 3
     , xPadding: 5
     , label: 'Stocks'})

   grid.set(0, 1, 1, 1, contrib.map, {label: 'Servers Location'})

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

**Rich dashboard**

See [source code](./examples/dashboard.js)

## License
This library is under the [MIT License](http://opensource.org/licenses/MIT)

## More Information
Created by Yaron Naveh ([twitter](http://twitter.com/YaronNaveh), [blog](http://webservices20.blogspot.com/))
