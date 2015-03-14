

var http = require('http')
  , url = require('url')
  , fs = require('fs')  

var port = process.env.PORT || 1337

http.createServer(function (req, res) {  
  
  fs.appendFileSync("./log.txt", new Date() + " - " + req.url + "\r\n")
  
  var in_query = url.parse(req.url, true).query  
  var out_query = fs.readFileSync('./weather.query')
  if (in_query.cols) out_query += "&cols="+in_query.cols
  if (in_query.rows) out_query += "&rows="+in_query.rows

  var location = process.env.BASE_REDIRECT + "?" + out_query
  res.writeHead(301, {'Location': location});  
  res.end()
    
}).listen(port);


console.log('Server running at http://127.0.0.1:'+port+'/');
