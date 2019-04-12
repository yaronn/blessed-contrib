"use strict";
var blessed = require('blessed')
  , Box = blessed.Box
  , marked = require('marked')
  , TerminalRenderer = require('marked-terminal')
  , chalk = require('chalk');


function Markdown(options) {
  if (!(this instanceof Box)) {
    return new Markdown(options);
  }

  options = options || {};

  installMarked(options);

  this.options = options;
  Box.call(this, options);

  if (options.markdown) this.setMarkdown(options.markdown);
}

Markdown.prototype = Object.create(Box.prototype);


Markdown.prototype.setMarkdown = function(str) {
  this.setContent(marked(str));
}

function installMarked(options) {

  const style = Object.assign({}, options.markdownStyle|| {});

  for (var st in style) {
    if (typeof(style[st])!="string") continue;

    var tokens = style[st].split('.');
    style[st] = chalk;
    for (var j=1; j<tokens.length; j++) {
      style[st] = style[st][tokens[j]];
    }

  }
  
  marked.setOptions({
    renderer: new TerminalRenderer(style)
  });

}

Markdown.prototype.getOptionsPrototype = function() {
  return {
    markdown: 'string',
    markdownStyle: 'object'
  }
}

Markdown.prototype.type = 'markdown';

module.exports = Markdown;
