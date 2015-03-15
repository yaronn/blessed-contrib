
exports.handle = function(req, res) {  
  req.url += "&subType=map&source=weather"
  require('./redirect-with-headers').handle(req, res)
}
