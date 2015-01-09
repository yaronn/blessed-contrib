var blessed = require('blessed')
   , Node = blessed.Node
   , Box = blessed.Box      
   , pictureTube = require('picture-tube')
   , fs = require('fs')
   , streams = require('memory-streams')
   
function Picture(options) {  
  var self = this

  if (!(this instanceof Node)) {
    return new Picture(options);
  }

  options = options || {};
  options.cols = options.cols || 50
  this.options = options
  
  var tube = pictureTube({cols: options.cols});
  fs.createReadStream(options.file).pipe(tube);  
  this.writer = new streams.WritableStream();
  tube.pipe(this.writer)

  tube.on('end', function() {
    if (options.onReady) {
      options.onReady()
    }
  });
  

  Box.call(this, options); 
}

Picture.prototype.render = function() {      
  
  this.setContent(this.writer.toString())
  return this._render()
}

Picture.prototype.__proto__ = Box.prototype;

Picture.prototype.type = 'picture';

module.exports = Picture