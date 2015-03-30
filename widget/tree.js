var blessed = require('blessed')
   , Node = blessed.Node
   , Box = blessed.Box      

function Tree(options) {  

  if (!(this instanceof Node)) {
    return new Tree(options);
  }

  options = options || {};
  options.bold = true;
  var self = this;
  this.options = options;
  this.data = {};
  this.nodeLines = [];
  this.lineNbr = 0;
  Box.call(this, options);

  options.extended = options.extended || false;
  options.keys = options.keys || ['+','space'];

  options.template = options.template || {};
  options.template.extend = options.template.extend || ' [+]';
  options.template.retract = options.template.retract || ' [-]';
  options.template.lines = options.template.lines || false;

  this.rows = blessed.list({
          height: 0,
          top: 1,
          width: 0,
          left: 1,    
          selectedFg: 'white',
          selectedBg: 'blue',
          fg: "green",
          keys: true          
        });
  
  this.rows.key(options.keys,function(){
    self.nodeLines[this.getItemIndex(this.selected)].extended = !self.nodeLines[this.getItemIndex(this.selected)].extended;
    self.setData(self.data);
    self.screen.render();

    self.emit('select',self.nodeLines[this.getItemIndex(this.selected)]);
  });

  this.append(this.rows)  
}

Tree.prototype.walk = function (node,depth) {

  var lines = [];

  if (!node.parent)
    node.parent = null;

  if (depth == 0 && node.name) {
    this.lineNbr = 0;
    this.nodeLines[this.lineNbr++] = node;
    lines.push(node.name);
    depth++;
  }

  node.depth = depth;

  if (node.children && node.extended) {

    var i = 0;
    
    if (typeof node.children == 'function')
      node.childrenContent = node.children(node);
    
    if(!node.childrenContent)
      node.childrenContent = node.children;

    for (var child in node.childrenContent) {
      
      if(!node.childrenContent[child].name)
        node.childrenContent[child].name = child;

      var childIndex = child;
      child = node.childrenContent[child];
      child.parent = node;
      
      if(typeof child.extended == 'undefined')
        child.extended = this.options.extended;
      
      if (typeof child.children == 'function')
        child.childrenContent = child.children(child);
      else
        child.childrenContent = child.children;
      
      var tree = '';
      var suffix = '';
      if(!child.childrenContent || Object.keys(child.childrenContent).length == 0){
        tree = '├─';
      } else if(child.extended) {
        tree = '├┐';
        suffix = this.options.template.retract;
      } else {
        tree = '├─';
        suffix = this.options.template.extend;
      }

      lines.push(' '+Array(depth).join('│') + tree + child.name+suffix);

      child.position = i++;

      this.nodeLines[this.lineNbr++] = child;
      lines = lines.concat(this.walk(child, depth+1));
    }
  }
  return lines;
}

Tree.prototype.focus = function(){
  this.rows.focus();
}

Tree.prototype.render = function() {
  if(this.screen.focused == this.rows)
    this.rows.focus()
  
  this.rows.width = this.width-3;
  this.rows.height = this.height-3;
  Box.prototype.render.call(this);
}

Tree.prototype.setData = function(data) {

  var formatted = [];
  formatted = this.walk(data,0);

  this.data = data;
  this.rows.setItems(formatted)
}

Tree.prototype.__proto__ = Box.prototype;

Tree.prototype.type = 'tree';

module.exports = Tree
