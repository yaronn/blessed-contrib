var blessed = require('blessed')
   , Node = blessed.Node
   , Box = blessed.Box      

function Table(options) {  

  if (!(this instanceof Node)) {
    return new Table(options);
  }

  options = options || {};
  options.bufferLength = options.bufferLength || 30
  options.columnSpacing = options.columnSpacing || 30
  options.bold = true
  this.options = options
  Box.call(this, options);

  this.rows = blessed.list({
          height: 0,
          top: 2,
          width: 0,
          left: 1,          
          selectedBg: 'blue',
          keys: true          
        });  

  this.append(this.rows)  
}

Table.prototype.render = function() {
  this.rows.focus()
  this.rows.width = this.width-3
  this.rows.height = this.height-4
  Box.prototype.render.call(this)
}


Table.prototype.setData = function(table) {    
  
  var dataToString = function(d) {
    var str = ""
    d.forEach(function(r) {      
      var spaces = new Array(self.options.columnSpacing-r.toString().length).join(' ')
      str += r + spaces
    })
    return str
  }

  var formatted = []
  var self = this

  table.data.forEach(function(d) {
    var str = dataToString(d);    
    formatted.push(str)
  })
  this.setContent(dataToString(table.headers))
  this.rows.setItems(formatted)
}

Table.prototype.__proto__ = Box.prototype;

Table.prototype.type = 'table';

module.exports = Table