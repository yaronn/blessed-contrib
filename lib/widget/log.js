var blessed = require('blessed')
   , Node = blessed.Node
   , List = blessed.List   

function Log(options) {  

  if (!(this instanceof Node)) {
    return new Log(options);
  }

  options = options || {};
  options.bufferLength = options.bufferLength || 30;
  this.options = options
  List.call(this, options);

  this.logLines = []
  this.log("") //first line is always selected and cannot be formatted with colors so put a dummy line
}


Log.prototype.log = function(str) {  
  this.logLines.push(str)  
  if (this.logLines.length>this.options.bufferLength) {
    this.logLines.shift()
  }
  this.setItems(this.logLines)
  this.scrollTo(this.logLines.length)
}

Log.prototype.__proto__ = List.prototype;

Log.prototype.type = 'log';

module.exports = Log