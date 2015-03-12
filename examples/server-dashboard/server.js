
var blessed = require('blessed')
  , Dashboard = require('./dashboard')
  , http = require('http')
  , url = require('url')
  , fs = require('fs')

var port = process.env.PORT || 1337

function OutputBuffer(options) {
   this.isTTY = true
   this.columns = options.cols
   this.rows = options.rows
   this.write = function(s) {
      options.res.write(s)
   }

  this.on = function() {}
}

function InputBuffer(options) {
   this.isTTY = true 
   this.isRaw = true

   this.emit = function() {}
  
   this.setRawMode = function() {}
   this.resume = function() {}
   this.pause = function() {}

   this.on = function() {}
}

http.createServer(function (req, res) {  
  
  fs.appendFileSync("./log.txt", new Date() + " - " + req.url)

  var query = url.parse(req.url, true).query

  var cols = query.cols || 165
  var rows = query.rows || 50

  if (cols<=35 || cols>=500 || rows<=5 || rows>=300) {
    res.writeHead(500, {'Content-Type': 'text/plain'});
    res.end("in this sample cols must be bigger than 35 and rows must be bigger than 5")
    return
  }

  res.writeHead(200, {'Content-Type': 'text/plain'});

  var output = new OutputBuffer({res: res, cols: cols, rows: rows})    
  var input = new InputBuffer() //required to run under forever since it replaces stdin to non-tty
  var program = blessed.program({output: output, input: input})  
  if (query.terminal) program.terminal = query.terminal
  if (query.isOSX) program.isOSXTerm = query.isOSX
  if (query.isiTerm2) program.isiTerm2 = query.isiTerm2  

  var screen = blessed.screen({program: program});

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
     this.screen = null
     this.program = null  
     buff = null
  });
    
}).listen(port);

console.log('Server running at http://127.0.0.1:'+port+'/');
