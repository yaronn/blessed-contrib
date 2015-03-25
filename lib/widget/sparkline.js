var blessed = require('blessed')
   , Node = blessed.Node
   , Box = blessed.Box   
   , sparkline = require('sparkline')

function Sparkline(options) {  

  if (!(this instanceof Node)) {
    return new Sparkline(options);
  }

  options = options || {};
  options.bufferLength = options.bufferLength || 30;
  options.style = options.style || {}
  options.style.titleFg = options.style.titleFg || 'white'
  this.options = options
  Box.call(this, options);

}

Sparkline.prototype.setData = function(titles, datasets) {  
  var res = '\r\n'
  for (var i=0; i<titles.length; i++) {
    res += '{bold}{'+this.options.style.titleFg+'-fg}' + titles[i]+':{/'+this.options.style.titleFg+'-fg}{/bold}\r\n'
    res += sparkline(datasets[i].slice(0, this.width-2)) + '\r\n\r\n'
  }
  
  this.setContent(res)
}

Sparkline.prototype.__proto__ = Box.prototype;

Sparkline.prototype.type = 'sparkline';

module.exports = Sparkline