
var http = require('http')
  , url = require('url')
  , fs = require('fs')  

var port = process.env.PORT || 1337

http.createServer(function (req, res) {  
  
  var ip = req.headers['x-forwarded-for'] || 
     req.connection.remoteAddress || 
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress;

  fs.appendFileSync("./log.txt", new Date() + " - " + req.url + + " - " + ip + "\r\n")
  var query = url.parse(req.url, true).query
  
  if (!query.type || (/[^a-zA-Z0-9\-]/.test(query.type))) {
    res.writeHead(500, {'Content-Type': 'text/plain'});
    res.end("request must have a 'type' parameter with alphanumeric content")
    return
  }

  var handler = './'+query.type
  if (!fs.existsSync(handler+".js")) {
    res.writeHead(500, {'Content-Type': 'text/plain'});
    res.end("could not find handler " + query.type)
    return
  }

  require(handler).handle(req, res)  
    
}).listen(port);

console.log('Server running at http://127.0.0.1:'+port+'/');
