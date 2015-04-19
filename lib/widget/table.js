var blessed = require('blessed')
   , Node = blessed.Node
   , Box = blessed.Box      

function Table(options) {  

  if (!(this instanceof Node)) {
    return new Table(options);
  }

  if (Array.isArray(options.columnSpacing)) {
     throw "Error: columnSpacing cannot be an array.\r\n" +
           "Note: From release 2.0.0 use property columnWidth instead of columnSpacing.\r\n" +
           "Please refere to the README or to https://github.com/yaronn/blessed-contrib/issues/39"
 
  }

  if (!options.columnWidth) {
    throw "Error: A table must get columnWidth as a property. Please refer to the README."
  }

  options = options || {};
  options.columnSpacing = options.columnSpacing==null? 10 : options.columnSpacing
  options.bold = true
  options.selectedFg = options.selectedFg || 'white'
  options.selectedBg = options.selectedBg || 'blue'
  options.fg = options.fg || 'green'
  options.bg = options.bg || ''
  options.interactive = options.interactive?options.interactive: true
  this.options = options
  Box.call(this, options);

  this.rows = blessed.list({
          height: 0,
          top: 2,
          width: 0,
          left: 1,    
          style: { selected: {
                      fg: options.selectedFg
                    , bg: options.selectedBg
                 }
                 , item: {
                      fg: options.fg
                    , bg: options.bg 
                 }},          
          keys: options.keys,
          interactive: options.interactive,
          screen: this.screen          
        });  

  this.append(this.rows)  
}

Table.prototype.focus = function(){
  this.rows.focus();
}

Table.prototype.render = function() {
  if(this.screen.focused == this.rows)
    this.rows.focus()
  
  this.rows.width = this.width-3
  this.rows.height = this.height-4
  Box.prototype.render.call(this)
}


Table.prototype.setData = function(table) {    
  
  var dataToString = function(d) {
    var str = ""
    d.forEach(function(r, i) {
      
      colsize = self.options.columnWidth[i];      
      
      r = r.toString().substring(0, colsize)
      var spaceLength = colsize - r.length + self.options.columnSpacing
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