var blessed = require('blessed')
  , contrib = require('../index')
  , mapWidget = require('../Widget/map')
  , logWidget = require('../Widget/log')
  , lineWidget = require('../Widget/Charts/line-simple')
  , tableWidget = require('../Widget/table')
  , pictureWidget = require('../Widget/picture')
  , barWidget = require('../Widget/Charts/bar')
  , gaugeWidget = require('../Widget/gauge')
  , sparklineWidget = require('../Widget/sparkline')


var screen = blessed.screen()

var grid = new contrib.Layout.Grid({rows: 1, cols: 2})

var grid1 = new contrib.Layout.Grid({rows: 1, cols: 3})
grid1.set(0, 0, logWidget, {fg: "green", selectedFg: "green", label: 'Server Log'})
grid1.set(0, 1, lineWidget, {style: {line: "yellow", text: "green", baseline: "black"}, xLabelPadding: 2, xPadding: 5, label: 'Network Latency (sec)'})
//grid1.set(0, 2, pictureWidget, {file: './examples/robot.png', cols: 22, onReady: ready, label: 'Active Users'})

var grid5 = new contrib.Layout.Grid({rows: 2, cols: 1})
grid5.set(0, 0, gaugeWidget, {label: 'Deployment Progress'})
grid5.set(1, 0, sparklineWidget, {label: 'Throughput (bits/sec)', tags: true, style: {fg: 'blue'}})
grid1.set(0, 2, grid5)

var grid4 = new contrib.Layout.Grid({rows: 1, cols: 2})
grid4.set(0, 0, barWidget, {label: 'Server Utilization (%)', barWidth: 4, barSpacing: 6, xOffset: 0, maxHeight: 9})
grid4.set(0, 1, tableWidget, {keys: true, fg: 'green', label: 'Active Processes', columnSpacing: 16})

var grid3 = new contrib.Layout.Grid({rows: 3, cols: 1})
grid3.set(0, 0, lineWidget, {style: {line: "red", text: "white", baseline: "black"}, label: 'Errors Rate', maxY: 60})
grid3.set(1, 0, grid4)
grid3.set(2, 0, grid1)


var grid2 = new contrib.Layout.Grid({rows: 2, cols: 1})
grid2.set(0, 0, lineWidget, {showNthLabel: 5, maxY: 100, label: 'Total Transactions'})
grid2.set(1, 0, mapWidget, {label: 'Servers Location'})

grid.set(0, 0, grid2)
grid.set(0, 1, grid3)




function ready() {
  screen.render()
}

grid.applyLayout(screen)

var line = grid2.get(0, 0)
var errorsLine = grid3.get(0, 0)
var latencyLine = grid1.get(0, 1)
var map = grid2.get(1, 0)
var log = grid1.get(0, 0)
var table = grid4.get(0,1)
//var pic = grid1.get(0, 2)
var sparkline = grid5.get(1, 0)
var gauge = grid5.get(0, 0)
var bar = grid4.get(0, 0)





/*
setTimeout(function() {
  pic.setImage({file: './examples/frog.png', cols: 22, onReady: ready})
}, 2000)
*/

var pct = 0
setInterval(function() {
  gauge.setPercent(pct++)  
  if (pct>100) pct = 0  
}, 200)



var servers = ['US1', 'US2', 'EU1', 'AU1', 'AS1', 'JP1']
var commands = ['grep', 'node', 'java', 'timer', '~/ls -l', 'netns', 'watchdog', 'gulp', 'tar -xvf', 'awk', 'npm install']

function fillBar() {
  bar.setData({titles: servers, data: [Math.round(Math.random()*10),Math.round(Math.random()*10),Math.round(Math.random()*10),Math.round(Math.random()*10),Math.round(Math.random()*10),Math.round(Math.random()*10)]})
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

var errorsData = {
   x: ['00:00', '00:05', '00:10', '00:15', '00:20', '00:25'],
   y: [30, 50, 70, 40, 50, 20]
}

var latencyData = {
   x: ['t1', 't2', 't3', 't4'],
   y: [5, 1, 7, 5]
}


var last = mockData.y[mockData.y.length-1]
var lastError = errorsData.y[errorsData.y.length-1]
var lastLatency = latencyData.y[latencyData.y.length-1]

setLineData()
setErrorsData()
setLatencyData()

generateTable()
table.focus()

screen.render()


function generateTable() {
   var data = []

   for (var i=0; i<30; i++) {
     var row = []          
     //row.push(servers[Math.round(Math.random()*(servers.length-1))])
     row.push(commands[Math.round(Math.random()*(commands.length-1))])
     row.push(Math.round(Math.random()*5))
     row.push(Math.round(Math.random()*100))

     data.push(row)
   }

   table.setData({headers: ['Process', 'Cpu (%)', 'Memory'], data: data})
}

setInterval(generateTable, 3000)


setInterval(function() {
   setLineData()   
   screen.render()
}, 500)

setInterval(function() {   
   setErrorsData()
   screen.render()
}, 1500)

setInterval(function() {   
   setLatencyData()
   screen.render()
}, 5000)

setInterval(function() {
   var rnd = Math.round(Math.random()*3)
   if (rnd==0) log.log('starting process ' + commands[Math.round(Math.random()*(commands.length-1))])   
   else if (rnd==1) log.log('terminating server ' + servers[Math.round(Math.random()*(servers.length-1))])
   else if (rnd==2) log.log('avg. wait time ' + Math.random().toFixed(2))
   screen.render()
}, 500)


var marker = true
setInterval(function() {
   if (marker) {
    map.addMarker({"lon" : "37.5000", "lat" : "-79.0000" })
    map.addMarker({"lon" : "45.5200", "lat" : "-122.6819" })
    map.addMarker({"lon" : "53.3478", "lat" : "-6.2597" })
    map.addMarker({"lon" : "1.3000", "lat" : "103.8000" })
   }
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

function setErrorsData() {    
  errorsData.y.shift()
  lastError = Math.max(lastError + Math.round(Math.random()*20) - 10, 10)
  errorsData.y.push(lastError)       
  errorsLine.setData(errorsData.x, errorsData.y)
}


function setLatencyData() {    
  latencyData.y.shift()
  lastLatency = Math.max(lastLatency + Math.round(Math.random()*8) - 4, 3)
  latencyData.y.push(lastLatency)       
  latencyLine.setData(latencyData.x, latencyData.y)
}

var spark1 = [1,2,5,2,1,5, 1,2,5,2,1,5, 4,4,5,4,1,5, 1,2,5,2,1,5, 1,2,5,2,1,5, 1,2,5,2,1,5]
var spark2 = [4,4,5,4,1,5, 1,2,5,2,1,5, 4,4,5,4,1,5, 1,2,5,2,1,5, 1,2,5,2,1,5, 1,2,5,2,1,5]

//refreshSpark()
setInterval(refreshSpark, 1000)

function refreshSpark() {
  spark1.shift()
  spark1.push(Math.random()*5+1)       
  spark2.shift()
  spark2.push(Math.random()*5+1)       
  sparkline.setData(['Server1', 'Server2'], [spark1, spark2])  
}
