var blessed = require('blessed')
  , contrib = require('../../index')

function Dashboard(options) {
  this.options = options  
  this.intervals = new Array()
}

Dashboard.prototype.setDisposableInterval = function(cba, timeout) {
  var interval = setInterval(cba, timeout)
  this.intervals.push(interval)
}

Dashboard.prototype.cleanup = function() {  
  for (var i=0; i<this.intervals.length; i++) {
    clearInterval(this.intervals[i])
  }
}

Dashboard.prototype.start = function() {
  
  var screen = this.options.screen

  //create layout and widgets
  var grid = new contrib.grid({rows: 1, cols: 2})

  var grid1 = new contrib.grid({rows: 1, cols: 3})
  grid1.set(0, 0, 1, 1, contrib.log, 
    { fg: "green"
    , selectedFg: "green"
    , label: 'Server Log'
    , screen: screen})
  grid1.set(0, 1, 1, 1, contrib.line, 
    { style: 
      { line: "yellow"
      , text: "green"
      , baseline: "black"}
    , xLabelPadding: 3
    , xPadding: 5
    , label: 'Network Latency (sec)'
    , screen: screen})

  var grid2 = new contrib.grid({rows: 2, cols: 1})
  grid2.set(0, 0, 1, 1, contrib.gauge, {label: 'Deployment Progress', screen: screen})
  grid2.set(1, 0, 1, 1, contrib.sparkline, 
    { label: 'Throughput (bits/sec)'
    , tags: true
    , style: { fg: 'blue' }
    , screen: screen})

  grid1.set(0, 2, 1, 1, grid2)

  var grid3 = new contrib.grid({rows: 1, cols: 2})
  grid3.set(0, 0, 1, 1, contrib.bar, 
    { label: 'Server Utilization (%)'
    , barWidth: 4
    , barSpacing: 6
    , xOffset: 2
    , maxHeight: 9
    , screen: screen})
  grid3.set(0, 1, 1, 1, contrib.table, 
    { keys: true
    , fg: 'green'
    , label: 'Active Processes'
    , columnSpacing: [24, 10, 10]
    , screen: screen})

  var grid4 = new contrib.grid({rows: 3, cols: 1})
  grid4.set(0, 0, 1, 1, contrib.line, 
    { style: 
      { line: "red"
      , text: "white"
      , baseline: "black"}
    , label: 'Errors Rate'
    , maxY: 60
    , screen: screen})
  grid4.set(1, 0, 1, 1, grid3)
  grid4.set(2, 0, 1, 1, grid1)

  var grid5 = new contrib.grid({rows: 2, cols: 1})
  grid5.set(0, 0, 1, 1, contrib.line, 
    { showNthLabel: 5
    , maxY: 100
    , label: 'Total Transactions'
    , screen: screen})
  grid5.set(1, 0, 1, 1, contrib.map, {label: 'Servers Location', screen: screen})
  grid.set(0, 0, 1, 1, grid5)
  grid.set(0, 1, 1, 1, grid4)

  grid.applyLayout(screen)

  var transactionsLine = grid5.get(0, 0)
  var errorsLine = grid4.get(0, 0)
  var latencyLine = grid1.get(0, 1)
  var map = grid5.get(1, 0)
  var log = grid1.get(0, 0)
  var table = grid3.get(0,1)
  var sparkline = grid2.get(1, 0)
  var gauge = grid2.get(0, 0)
  var bar = grid3.get(0, 0)


  //dummy data
  var servers = ['US1', 'US2', 'EU1', 'AU1', 'AS1']
  var commands = ['grep', 'node', 'java', 'timer', '~/ls -l', 'netns', 'watchdog', 'gulp', 'tar -xvf', 'awk', 'npm install']


  //set dummy data on gauge
  var gauge_percent = 0
  this.setDisposableInterval(function() {
    gauge.setPercent(gauge_percent++)  
    if (gauge_percent>100) gauge_percent = 0  
  }, 400)


  //set dummy data on bar chart
  function fillBar() {
    var arr = []
    for (var i=0; i<servers.length; i++) {
      arr.push(Math.round(Math.random()*10))
    }
    bar.setData({titles: servers, data: arr})
  }
  fillBar()
  this.setDisposableInterval(fillBar, 3500)


  //set dummy data for table
  function generateTable() {
     var data = []

     for (var i=0; i<30; i++) {
       var row = []          
       row.push(commands[Math.round(Math.random()*(commands.length-1))])
       row.push(Math.round(Math.random()*5))
       row.push(Math.round(Math.random()*100))

       data.push(row)
     }

     table.setData({headers: ['Process', 'Cpu (%)', 'Memory'], data: data})
  }

  generateTable()
  table.focus()
  this.setDisposableInterval(generateTable, 6000)


  //set log dummy data
  this.setDisposableInterval(function() {
     var rnd = Math.round(Math.random()*2)
     if (rnd==0) log.log('starting process ' + commands[Math.round(Math.random()*(commands.length-1))])   
     else if (rnd==1) log.log('terminating server ' + servers[Math.round(Math.random()*(servers.length-1))])
     else if (rnd==2) log.log('avg. wait time ' + Math.random().toFixed(2))
     //screen.render()
  }, 3000)


  //set spark dummy data
  var spark1 = [1,2,5,2,1,5,1,2,5,2,1,5,4,4,5,4,1,5,1,2,5,2,1,5,1,2,5,2,1,5,1,2,5,2,1,5]
  var spark2 = [4,4,5,4,1,5,1,2,5,2,1,5,4,4,5,4,1,5,1,2,5,2,1,5,1,2,5,2,1,5,1,2,5,2,1,5]

  refreshSpark()
  this.setDisposableInterval(refreshSpark, 1000)

  function refreshSpark() {
    spark1.shift()
    spark1.push(Math.random()*5+1)       
    spark2.shift()
    spark2.push(Math.random()*5+1)       
    sparkline.setData(['Server1', 'Server2'], [spark1, spark2])  
  }



  //set map dummy markers
  var marker = true
  this.setDisposableInterval(function() {
     if (marker) {
       map.addMarker({"lon" : "-79.0000", "lat" : "37.5000", color: 'yellow', char: 'X' })
       map.addMarker({"lon" : "-122.6819", "lat" : "45.5200" })
       map.addMarker({"lon" : "-6.2597", "lat" : "53.3478" })
       map.addMarker({"lon" : "103.8000", "lat" : "1.3000" })
     }
     else {
      map.clearMarkers()
     }
     marker =! marker    

     //screen.render()
  }, 1000)




  //set line charts dummy data

  var transactionsData = {
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

  setLineData(transactionsData, transactionsLine)
  setLineData(errorsData, errorsLine)
  setLineData(latencyData, latencyLine)

  this.setDisposableInterval(function() {
     setLineData(transactionsData, transactionsLine)
     //screen.render()
  }, 1500)

  this.setDisposableInterval(function() {   
     setLineData(errorsData, errorsLine)
     //screen.render()
  }, 2500)

  this.setDisposableInterval(function() {   
     setLineData(latencyData, latencyLine)
     //screen.render()
  }, 5000)

  function setLineData(mockData, line) {
    var last = mockData.y[mockData.y.length-1]
    mockData.y.shift()
    var num = Math.max(last + Math.round(Math.random()*10) - 5, 10)    
    mockData.y.push(num)     
    line.setData(mockData.x, mockData.y)
  }


  screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
  });

  screen.render()

  this.setDisposableInterval(function() {       
    screen.render()
  }, 1500)
}

module.exports = Dashboard
