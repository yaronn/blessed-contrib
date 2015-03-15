
exports.handle = function(req, res) {  
  req.url += "&subType=bar&source=elections"
  require('./redirect-with-headers').handle(req, res)
}

