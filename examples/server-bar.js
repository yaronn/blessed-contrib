
var blessed = require('blessed')
  , http = require('http')
  , url = require('url')
  , fs = require('fs')
  , contrib = require('../index')  

var port = process.env.PORT || 1337

http.createServer(function (req, res) {  
  
  fs.appendFileSync("./log.txt", new Date() + " - " + req.url)

  
  var query = url.parse(req.url, true).query
  
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
    
}).listen(port);

function renderBars(screen, titles, data, res) {


  var bar = contrib.bar(
    { label: ''
    , barWidth: 4
    , barSpacing: 6
    , xOffset: 2
    , maxHeight: Math.max.apply(Math, data) + 15
    , height: screen.rows - 5
    , width: screen.cols - 5
    , screen: screen})

  screen.append(bar)


  var max = Math.max.apply(Math, data)
  var jump = Math.round(max / 10)

  var render = function(screen, titles, data, currMax, globalMax) {
    
    if (currMax>globalMax) {
      //res.end()
      return
    }
    
    var currData = data.map(function (x) { 
      return Math.min(currMax, parseInt(x, 10))
    });

    bar.setData({titles: titles, data: currData})
    screen.render()

    setTimeout(function() {
      render(screen, titles, data, currMax+jump, globalMax)
    }, 150)
  }

  
  render(screen, titles, data, 0, max)
  
}


console.log('Server running at http://127.0.0.1:'+port+'/');
