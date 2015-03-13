var http = require('http')
  , url = require('url')
  , fs = require('fs')
  , contrib = require('../index')
  , Canvas = require('drawille-canvas-blessed-contrib').Canvas
  , Map = require('map-canvas')


var port = process.env.PORT || 1337

http.createServer(function (req, res) {  
  
  fs.appendFileSync("./log.txt", new Date() + " - " + req.url + "\r\n")
  
  var query = url.parse(req.url, true).query
    
  var screen = contrib.createScreen(req, res)
  if (!screen) return

  var size = {height: query.rows || 232, width: query.cols || 380}
  canvas = new Canvas(size.width, size.height)
  var ctx = canvas.getContext()
  ctx.strokeStyle="green"
  ctx.fillStyle="green"
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  var options = { excludeAntartica: true
                , disableBackground: true
                , disableMapBackground: true
                , disableGraticule: true
                , disableFill: true
                , height: size.height
                , width: size.width
                , startLon: query.startLon || 50
                , endLon: query.endLon || 110
                , startLat: query.startLat || 115
                , endLat: query.endLat || 140 
                , region: query.region || 'us'}

  var map = new Map(options, canvas)
  map.draw()  

  var markerCount = query.markerCount  
  if (markerCount) {    
    for (var i=0; i<markerCount; i++) {

      map.addMarker( { "lon" : query["lon"+i]
                     , "lat": query["lat"+i]
                     , "color": query["color"+i] || "red"
                     , "char": query["char"+i] || "X" } )
    }    
  }
    

  res.end(ctx._canvas.frame());

  var auto_disconnect = setTimeout(function() {
      console.log("auto disconnect")
      res.end("chart auto-disconnected after 60 seconds")
    }, 60000)

  req.connection.on('close',function(){    
     console.log("cleanup")
     screen = null     
    });
    
}).listen(port);

console.log('Server running at http://127.0.0.1:'+port+'/');
