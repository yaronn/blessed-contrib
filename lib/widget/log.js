'use strict';
var blessed = require('blessed')
  , Node = blessed.Node
  , List = blessed.List;

function Log(options) {
  if (!(this instanceof Node)) {
    return new Log(options);
  }

  options = options || {};
  options.bufferLength = options.bufferLength || 30;
  this.options = options;
  List.call(this, options);

  this.logLines = [];
  this.interactive = false;
}

Log.prototype = Object.create(List.prototype);

Log.prototype.log = function(str, prefix, suffix) {
  if(!prefix) prefix = ""
  if(!suffix) suffix = ""
  let lines = splitString(str, this.options.screen.width - 30, prefix, suffix)
  for(let i = 0; i < lines.length; i++){
    lines[i] = lines[i].trim()
    this.logLines.push(lines[i]);
  }
  if (this.logLines.length>this.options.bufferLength) {
    this.logLines.shift();
  }
  this.setItems(this.logLines);
  this.scrollTo(this.logLines.length);
};

function splitString(str, approxMaxChars, prefix, suffix){
  str = str.trim()
  if((/\s/g).test(str)) str = str.replace(new RegExp(`(?![^\\n]{1,${approxMaxChars}}$)([^\\n]{1,${approxMaxChars}})\\s`, "g"), '$1\n')
  else str = str.replace(new RegExp(`(?![^\\n]{1,${approxMaxChars}}$)([^\\n]{1,${approxMaxChars}})`, "g"), '$1\n')
  let strArr = str.split("\n")
  let returnArr = []
  for(let i = 0; i < strArr.length; i++){
    let newStr = ""
    if((/\s/g).test(strArr[i])) newStr = strArr[i].replace(new RegExp(`(?![^\\n]{1,${approxMaxChars}}$)([^\\n]{1,${approxMaxChars}})\\s`, "g"), '$1\n')
    else newStr = strArr[i].replace(new RegExp(`(?![^\\n]{1,${approxMaxChars}}$)([^\\n]{1,${approxMaxChars}})`, "g"), '$1\n')
    let temp = newStr.split("\n")
    for(let j = 0; j < temp.length; j++){
      returnArr.push(`${prefix}${temp[j]}${suffix}`)
    }
  }
  return returnArr
}

Log.prototype.type = 'log';

module.exports = Log;
