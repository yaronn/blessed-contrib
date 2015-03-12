var blessed = require('blessed')
   , Node = blessed.Node
   , Box = blessed.Box      

function Table(options) {  

  if (!(this instanceof Node)) {
    return new Table(options);
  }

  options = options || {};
  options.columnSpacing = options.columnSpacing || 30
  options.bold = true
  this.options = options
  Box.call(this, options);

  this.rows = blessed.list({
          height: 0,
          top: 2,
          width: 0,
          left: 1,    
          selectedFg: 'white',
          selectedBg: 'blue',
          fg: "green",
          keys: true,
          screen: this.screen          
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
    d.forEach(function(r, i) {

      var colsize = self.options.columnSpacing;
      if(typeof self.options.columnSpacing == "object") {
        colsize = self.options.columnSpacing[i];
      }

      var spaceLength = colsize - r.toString().length
      if (spaceLength < 0) {
        spaceLength = 0;
      }
      var spaces = new Array(spaceLength).join(' ')
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