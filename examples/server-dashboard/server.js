
var blessed = require('blessed')
  , Dashboard = require('./dashboard')
  , http = require('http')
  , url = require('url')
  , fs = require('fs')
  , contrib = require('../../index')  

var port = process.env.PORT || 1337

http.createServer(function (req, res) {  
  
  fs.appendFileSync("./log.txt", new Date() + " - " + req.url)

  var screen = contrib.createScreen(req, res)    
  if (!screen) return
  
  var d = new Dashboard({screen: screen})  
  d.start()

  var auto_disconnect = setTimeout(function() {
    console.log("auto disconnect")
    res.end("dashboard auto-disconnected after 60 seconds")
  }, 60000)

  req.connection.on('close',function(){    
     clearTimeout(auto_disconnect)
     console.log("cleanup")
     d.cleanup()
     screen = null     
  });
    
}).listen(port);

console.log('Server running at http://127.0.0.1:'+port+'/');
