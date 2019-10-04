'use strict';
var blessed = require('blessed')
  , Node = blessed.Node
  , Box = blessed.Box
  , sparkline = require('sparkline');

function Sparkline(options) {

  var self = this;

  if (!(this instanceof Node)) {
    return new Sparkline(options);
  }

  options = options || {};
  options.bufferLength = options.bufferLength || 30;
  options.style = options.style || {};
  options.style.titleFg = options.style.titleFg || 'white';
  this.options = options;
  Box.call(this, options);


  this.on('attach', function() {
    if (self.options.data) {
      self.setData(self.options.data.titles, self.options.data.data);
    }
  });
}

Sparkline.prototype = Object.create(Box.prototype);

Sparkline.prototype.setData = function(titles, datasets) {
  var res = '\r\n';
  for (var i=0; i<titles.length; i++) {
    res += '{bold}{'+this.options.style.titleFg+'-fg}' + titles[i]+':{/'+this.options.style.titleFg+'-fg}{/bold}\r\n';
    res += sparkline(datasets[i].slice(0, this.width-2)) + '\r\n\r\n';
  }

  this.setContent(res);
};

Sparkline.prototype.getOptionsPrototype = function() {
  return { label: 'Sparkline'
    , tags: true
    , border: {type: 'line', fg: 'cyan'}
    , width: '50%'
    , height: '50%'
    , style: { fg: 'blue' }
    , data: { titles: [ 'Sparkline1', 'Sparkline2'],
      data: [ [10, 20, 30, 20, 50, 70, 60, 30, 35, 38]
        , [40, 10, 40, 50, 20, 30, 20, 20, 19, 40] ]
    }
  };
};

Sparkline.prototype.type = 'sparkline';

module.exports = Sparkline;
