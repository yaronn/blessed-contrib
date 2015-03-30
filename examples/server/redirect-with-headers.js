
var url = require('url')
  , fs = require('fs')

function handle(req, res) {
  var query = url.parse(req.url, true).query  
  query = query || {}
  query.type = query.subType
  delete query.subType
  
  var location = process.env.REDIRECT_BASE
  location += "?"
  for (var q in query) {
   location+="&"+q+"="+query[q]
  }
    
  if (query.source && !/[^a-zA-Z0-9]/.test(query.source)) {
   var file = query.source + ".dat"
   if (!fs.existsSync(file)) {
      res.writeHead(500, {'Content-Type': 'text/plain'});
      res.end("could not find data for " + query.source)
      return
   }
   var content = fs.readFileSync(file)
   location += "&" + content
  }
  
  res.writeHead(301, {'Location': location});  
  res.end()
}

exports.handle = handle
