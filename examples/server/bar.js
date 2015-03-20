
var blessed = require('blessed')  
  , url = require('url')
  , fs = require('fs')
  , contrib = require('../../index')  


function handle(req, res) {
  
  var query = url.parse(req.url, true).query
  
  if (!query.titles || !query.data) {
    res.writeHead(500, {'Content-Type': 'text/plain'});
    res.end("No titles or data were provided")
    return
  }

  var titles = query.titles.split(',')
  var data = query.data.split(',')
  
  if (titles.length>50 || data.length>50) {
    res.writeHead(500, {'Content-Type': 'text/plain'});
    res.end("A maximum of 50 bars is allowed")
    return
  }

  if (titles.length==0 || data.length==0) {
    res.writeHead(500, {'Content-Type': 'text/plain'});
    res.end("No bars were specified")
    return
  }

  var dataInt = data.map(function (x) { 
      return parseInt(x, 10); 
  });
  
  var screen = contrib.createScreen(req, res)
  if (!screen) return

  renderBars(screen, titles, dataInt, res)


  var auto_disconnect = setTimeout(function() {
      console.log("auto disconnect")
      res.end("chart auto-disconnected after 60 seconds")
    }, 60000)

  req.connection.on('close',function(){    
     clearTimeout(auto_disconnect)
     console.log("cleanup")
     screen = null     
    });
    
}

function renderBars(screen, titles, data, res) {


  var bar = contrib.bar(
    { label: ''
    , barWidth: 6
    , barSpacing: 8
    , xOffset: 2
    , maxHeight: Math.max.apply(Math, data) + 15
    , height: screen.rows - 5
    , width: screen.cols - 5
    , screen: screen})

  screen.append(bar)


  var max = Math.max.apply(Math, data)
  var jump = Math.ceil(max / 20)

  var render = function(screen, titles, data, currMax, globalMax) {
    
    if (currMax>=globalMax+jump) {
      res.write('\r\n\r\n')
      //restore cursor
      res.end('\033[?25h')
      return
    }
    
    var currData = data.map(function (x) { 
      return Math.min(currMax, parseInt(x, 10))
    });

    bar.setData({titles: titles, data: currData})
    screen.render()

    setTimeout(function() {
      render(screen, titles, data, currMax+jump, globalMax)
    }, 100)
  }

  
  render(screen, titles, data, 0, max)
  
}

exports.handle = handle