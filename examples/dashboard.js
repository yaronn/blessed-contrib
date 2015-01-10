var blessed = require('blessed')
  , contrib = require('../index')
  , mapWidget = require('../Widget/map')
  , logWidget = require('../Widget/log')
  , lineWidget = require('../Widget/Charts/line')
  , tableWidget = require('../Widget/table')
  , pictureWidget = require('../Widget/picture')
  , barWidget = require('../Widget/Charts/bar')


var screen = blessed.screen()

var map_opt = {  
  canvas: {
    width: 140,
    height: 52
  }
};

var line_opt = {  
  canvas: {
    width: 152,
    height: 68
  },

  lineChartData : {   
   datasets : [
   {
     label: "My First dataset",
     fillColor : "red",
     strokeColor : "yellow",
     pointColor : "black",
     pointStrokeColor : "black",
     pointHighlightFill : "green",
     pointHighlightStroke : "white",
   }
   ]
 }
}

var bar_opt = {  
  canvas: {
    width: 80,
    height: 20
  }
};


var grid = new contrib.Layout.Grid({rows: 3, cols: 2})
grid.set(0, 0, lineWidget, line_opt)
grid.set(0, 1, mapWidget, map_opt)
grid.set(1, 0, logWidget, {fg: "green", selectedFg: "green"})
grid.set(1, 1, tableWidget, {keys: true, fg: 'green'})
grid.set(2, 0, pictureWidget, {file: './examples/robot.png', cols: 32, onReady: ready})
grid.set(2, 1, barWidget, bar_opt)

function ready() {
  screen.render()
}


grid.applyLayout(screen)

var line = grid.get(0, 0)
var map = grid.get(0, 1)
var log = grid.get(1, 0)
var table = grid.get(1, 1)
var pic = grid.get(2, 0)
var bar = grid.get(2, 1)


setTimeout(function() {
  pic.setImage({file: './examples/frog.png', cols: 32, onReady: ready})
}, 2000)


function fillBar() {
  bar.setData({titles: ['a', 'b', 'c'], data: [Math.round(Math.random()*10),Math.round(Math.random()*10),Math.round(Math.random()*10)]})
}
fillBar()
setInterval(fillBar, 2000)



screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});


var mockData = {
   x: ['00:00', '00:05', '00:10', '00:15', '00:20', '00:30', '00:40', '00:50', '01:00', '01:10', '01:20', '01:30', '01:40', '01:50', '02:00', '02:10', '02:20', '02:30', '02:40', '02:50', '03:00', '03:10', '03:20', '03:30', '03:40', '03:50', '04:00', '04:10', '04:20', '04:30'],
   y: [0, 10, 40, 45, 45, 50, 55, 70, 65, 58, 50, 55, 60, 65, 70, 80, 70, 50, 40, 50, 60, 70, 82, 88, 89, 89, 89, 80, 72, 70]
}


var last = mockData.y[mockData.y.length-1]
setLineData()

generateTable()
table.focus()

screen.render()


function generateTable() {
   var data = []

   for (var i=0; i<30; i++) {
     var row = []
     for (var j=0; j<3; j++) {
      row.push(Math.round(Math.random()*100))
     }
     data.push(row)
   }

   table.setData({headers: ['Aaa', 'Bbb', 'Ccc'], data: data})
}

setInterval(generateTable, 2000)

setInterval(function() {
   setLineData()   
   screen.render()
}, 500)


setInterval(function() {
   log.log(Math.random() + 'this is some log')   
   screen.render()
}, 100)


var marker = true
setInterval(function() {
   if (marker) map.addMarker({"lon" : "37.5000", "lat" : "-79.0000" })
   else map.clearMarkers()
   marker =! marker
   screen.render()
}, 1000)


function setLineData() {  
  
  mockData.y.shift()
  last = Math.max(last + Math.round(Math.random()*10) - 5, 10)    
  mockData.y.push(last)     
  line.setData(mockData.x, mockData.y)
}
