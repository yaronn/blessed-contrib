
var blessed = require('blessed')
   , Box = blessed.Box
   , marked = require('marked')
   , TerminalRenderer = require('marked-terminal')


function Markdown(options) {
  
  if (!(this instanceof Box)) {
    return new Markdown(options);
  }

  marked.setOptions({
    renderer: new TerminalRenderer()
  });

  options = options || {};
  this.options = options
  Box.call(this, options);

  if (options.markdown) this.setMarkdown(options.markdown)
}


Markdown.prototype.setMarkdown = function(str) {
  this.setContent(marked(str))
}

Markdown.prototype.__proto__ = Box.prototype;

Markdown.prototype.type = 'markdown';

module.exports = Markdown
